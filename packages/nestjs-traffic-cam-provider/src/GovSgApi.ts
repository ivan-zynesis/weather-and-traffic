import {TrafficCamData, TrafficCamDataService} from "./abstract";
import axios, {AxiosInstance} from "axios";
import {Telemetry} from "@repo/telemetry";

export class GovSgApi implements TrafficCamDataService {
  private client: AxiosInstance;

  constructor(
    private readonly telemetry: Telemetry
  ) {
    this.client = axios.create({
      baseURL: 'https://api.data.gov.sg/v1',
    });
  }

  /**
   * @param isoString previous page last row timestamp
   * @param options omitted, service provider does not support 'asc' order and return results of one closest timestamp
   */
  async query(isoString?: string): Promise<TrafficCamData[]> {
    const result = await this.client.get('transport/traffic-images', {
      params: {
        date_time: isoString,
      },
    });

    if (result.statusText !== 'OK') {
      await this.telemetry.error(JSON.stringify(result));
      throw new Error(`${GovSgApi.name} is down`);
    }

    return this.plainToObject(result.data);
  }

  private async plainToObject(data: any): Promise<TrafficCamData[]> {
    const unexpectedResponse = new Error(`${GovSgApi.name} is not providing expected data`);
    if (
      !Array.isArray(data.items) ||
      data.items.length !== 1 ||
      !Array.isArray(data.items[0].cameras)
    ) {
      await this.telemetry.error(JSON.stringify(data));
      throw new Error(`Unexpected data structure from ${GovSgApi.name}`)
    }

    return data.items[0].cameras.map((c: any): TrafficCamData => ({
      cameraId: c.camera_id,
      cursor: c.timestamp,
      image: {
        src: c.image,
        metadata: c.image_metadata as any,
      },
      location: {
        lat: c.location.latitude,
        lng: c.location.longitude,
      },
    }));
  }
}
