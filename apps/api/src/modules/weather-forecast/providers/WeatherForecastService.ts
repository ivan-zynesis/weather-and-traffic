import { Injectable } from '@nestjs/common';
import {
  Coordinate,
  ReverseGeocodingService,
} from '../../reverse-geocoding/providers/abstract';
import {
  Forecast,
  WeatherDataService,
} from '../../data-service/providers/WeatherDataService';

@Injectable()
export class WeatherForecastService {
  constructor(
    private readonly reverseGeocoding: ReverseGeocodingService,
    private readonly weatherDataService: WeatherDataService,
  ) {}

  async getForecast(coordinate: Coordinate): Promise<Forecast | null> {
    const location = await this.reverseGeocoding.lookup(coordinate);
    if (!location) {
      return null;
    }

    const latest = await this.weatherDataService.getForecasts();
    const locationForecast = latest.forecasts.find(
      (forecast) => forecast.area === location,
    );

    return locationForecast ?? null;
  }
}
