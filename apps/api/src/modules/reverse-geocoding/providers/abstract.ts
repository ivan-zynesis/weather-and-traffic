import { Injectable } from '@nestjs/common';

export interface Coordinate {
  lat: number;
  lng: number;
}

@Injectable()
export abstract class ReverseGeocodingService {
  abstract lookup(coordinate: Coordinate): Promise<string | null>;
}
