import { Injectable } from '@nestjs/common';

export interface Forecast {
  area: string;
  forecast: string;
}

export interface DateTimeRange {
  start: string;
  end: string;
}

export interface WeatherForecasts {
  updateTimestamp: string;
  timestamp: string;
  validPeriod: DateTimeRange;
  forecasts: Forecast[];
}

@Injectable()
export abstract class WeatherDataService {
  abstract getForecasts(filter?: {
    date?: string;
    date_time?: string;
  }): Promise<WeatherForecasts>;
}
