import { Coordinate, ReverseGeocodingService } from './abstract';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosInstance } from 'axios';
import { CacheServiceProvider } from '../../cache/providers/abstract';

@Injectable()
export class GoogleReverseReverseGeocoding extends ReverseGeocodingService {
  private readonly client: Pick<AxiosInstance, 'get'>;

  constructor(
    private readonly configService: ConfigService,
    private readonly cache: CacheServiceProvider,
  ) {
    super();
    this.client = this.cache.cachedAxiosGetClient(
      axios.create({
        baseURL: 'https://maps.googleapis.com/maps/api',
      }),
    );
  }

  async lookup(coordinate: Coordinate): Promise<string | null> {
    const url = `/geocode/json`;
    const response = await this.client.get(url, {
      params: {
        latlng: `${coordinate.lat},${coordinate.lng}`,
        key: `${this.configService.get('apiKeys.google.reverseGeocoding')}`,
      },
    });

    try {
      const closestGuess = response.data.results[0].address_components;
      const neighborhood = closestGuess.find((addressComponent) =>
        addressComponent.types.includes('neighborhood'),
      )!;
      return neighborhood.long_name;
    } catch (e: any) {
      return null;
    }
  }
}
