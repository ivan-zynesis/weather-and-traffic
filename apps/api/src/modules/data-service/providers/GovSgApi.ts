import { WeatherDataService, WeatherForecasts } from './WeatherDataService';
import axios, { AxiosInstance } from 'axios';
import { Telemetry } from '../../telemetry/providers/type';
import { Injectable } from '@nestjs/common';
import { TrafficCamData, TrafficCamDataService } from './TrafficCamDataService';
import { CacheServiceProvider } from '../../cache/providers/abstract';
import { AreaMetadata, GeoLocationDataService } from './GeoLocationDataService';

@Injectable()
export class GovSgApi
  implements TrafficCamDataService, WeatherDataService, GeoLocationDataService
{
  private client: Pick<AxiosInstance, 'get'>;

  constructor(
    private readonly telemetry: Telemetry,
    cacheProvider: CacheServiceProvider,
  ) {
    this.client = cacheProvider.cachedAxiosGetClient(
      axios.create({
        baseURL: 'https://api.data.gov.sg/v1',
      }),
    );
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

    return this.trafficResDto(result.data);
  }

  private async trafficResDto(data: any): Promise<TrafficCamData[]> {
    if (
      !Array.isArray(data.items) ||
      data.items.length !== 1 ||
      !Array.isArray(data.items[0].cameras)
    ) {
      await this.telemetry.error(JSON.stringify(data));
      throw new Error(
        `Unexpected data structure from ${GovSgApi.name}.queryTrafficCamData`,
      );
    }

    return data.items[0].cameras.map(
      (c: any): TrafficCamData => ({
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
      }),
    );
  }

  private async fetchWeatherForecast(filter?: {
    date?: string;
    date_time?: string;
  }): Promise<any> {
    const result = await this.client.get(
      'environment/2-hour-weather-forecast',
      {
        params: filter,
      },
    );

    if (result.statusText !== 'OK') {
      await this.telemetry.error(JSON.stringify(result));
      throw new Error(`${GovSgApi.name} is down`);
    }

    return result.data;
  }

  async getForecasts(filter?: {
    date?: string;
    date_time?: string;
  }): Promise<WeatherForecasts> {
    const data = await this.fetchWeatherForecast(filter);
    return this.forecastResDto(data);
  }

  private async forecastResDto(data: any): Promise<WeatherForecasts> {
    if (
      !Array.isArray(data.items) ||
      // quick implementation, empty list is legit
      data.items.length === 0 ||
      !Array.isArray(data.items[0].forecasts)
    ) {
      await this.telemetry.error(JSON.stringify(data));
      throw new Error(
        `Unexpected data structure from ${GovSgApi.name}.getForecasts`,
      );
    }

    const forecasts = data.items.reduce((joined, item) => {
      item.forecasts.forEach((f) => joined.push(f));
      return joined;
    }, []);

    return {
      timestamp: data.items[0].timestamp,
      updateTimestamp: data.items[0].update_timestamp,
      validPeriod: data.items[0].valid_period,
      forecasts,
    };
  }

  async getAreaMetadata(): Promise<AreaMetadata[]> {
    const data = await this.fetchWeatherForecast();
    return this.areaMetadataDto(data);
  }

  private async areaMetadataDto(data: any): Promise<AreaMetadata[]> {
    if (!Array.isArray(data.area_metadata) || data.area_metadata.length === 0) {
      await this.telemetry.error(JSON.stringify(data));
      throw new Error(
        `Unexpected data structure from ${GovSgApi.name}.getAreaMetadata`,
      );
    }

    return data.area_metadata.map((a: any) => ({
      name: a.name,
      labelLocation: {
        lat: a.label_location.latitude,
        lng: a.label_location.longitude,
      },
    }));
  }
}
