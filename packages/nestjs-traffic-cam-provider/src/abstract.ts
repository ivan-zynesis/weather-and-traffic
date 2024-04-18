// TODO: refactor to upstream, shared across multi services
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
  query(lastCursor?: string, options?: { order?: 'asc' | 'desc'; limit?: number }): Promise<Data[]>;
}

export type TrafficCamDataService = PaginatedDataProvider<TrafficCamData>;
