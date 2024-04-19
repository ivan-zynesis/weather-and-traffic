import { Injectable } from '@nestjs/common';
import { GeoLocation } from './TrafficCamDataService';

export interface AreaMetadata {
  name: string;
  labelLocation: GeoLocation;
}

@Injectable()
export abstract class GeoLocationDataService {
  abstract getAreaMetadata(): Promise<AreaMetadata[]>;
}
