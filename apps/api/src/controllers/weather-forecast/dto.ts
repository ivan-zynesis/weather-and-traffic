import { ApiProperty } from '@nestjs/swagger';
import {
  DateTimeRange,
  Forecast as ForecastI,
  WeatherForecasts,
} from '../../modules/data-service/providers/WeatherDataService';

class Forecast implements ForecastI {
  @ApiProperty({ type: String })
  area!: string;

  @ApiProperty({ type: String })
  forecast!: string;
}

export class WeatherForecastResponse implements WeatherForecasts {
  @ApiProperty({ type: String })
  timestamp: string;

  @ApiProperty({ type: String })
  updateTimestamp: string;

  @ApiProperty({ type: String })
  validPeriod: DateTimeRange;

  @ApiProperty({ type: [Forecast] })
  forecasts: Forecast[];
}
