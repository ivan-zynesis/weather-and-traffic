import { Injectable } from '@nestjs/common';

// TODO: refactor to upstream, shared across multi modules
export interface GeoLocation {
  lat: number;
  lng: number;
}

export interface Image {
  src: string;
  metadata: {
    width?: number;
    height?: number;
    md5?: string;
  };
}

export interface PaginatedDataItem {
  cursor: string;
}

export interface TrafficCamData extends PaginatedDataItem {
  cameraId: string;
  image: Image;
  location: GeoLocation;
}

export interface PaginatedDataProvider<Data> {
  query(
    lastCursor?: string,
    options?: { order?: 'asc' | 'desc'; limit?: number },
  ): Promise<Data[]>;
}

@Injectable()
export abstract class TrafficCamDataService
  implements PaginatedDataProvider<TrafficCamData>
{
  abstract query(
    lastCursor?: string,
    options?: { order?: 'asc' | 'desc'; limit?: number },
  ): Promise<TrafficCamData[]>;
}
