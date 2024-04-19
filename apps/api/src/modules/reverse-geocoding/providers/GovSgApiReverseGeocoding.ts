import { Coordinate, ReverseGeocodingService } from './abstract';
import { Injectable } from '@nestjs/common';
import {
  AreaMetadata,
  GeoLocationDataService,
} from '../../data-service/providers/GeoLocationDataService';

@Injectable()
export class GovSgApiReverseGeocoding extends ReverseGeocodingService {
  constructor(private readonly geoLocationDataService: GeoLocationDataService) {
    super();
  }

  /**
   * FIXME: naive implementation without bother much for accuracy and performance
   */
  async lookup(toLookUp: Coordinate): Promise<string | null> {
    const areaMetadata = await this.geoLocationDataService.getAreaMetadata();

    if (areaMetadata.length === 0) {
      return null;
    }

    const sortedByMinCoorDiff: AreaMetadata[] = areaMetadata
      .map((datum) => {
        return {
          name: datum.name,
          labelLocation: {
            lat: Math.abs(datum.labelLocation.lat - toLookUp.lat),
            lng: Math.abs(datum.labelLocation.lng - toLookUp.lng),
          },
        };
      })
      .sort((a, b) => {
        // lol, flat earth?
        const sumA = a.labelLocation.lat + a.labelLocation.lng;
        const sumB = b.labelLocation.lat + b.labelLocation.lng;
        return sumA - sumB;
      });

    return sortedByMinCoorDiff[0].name;
  }
}
