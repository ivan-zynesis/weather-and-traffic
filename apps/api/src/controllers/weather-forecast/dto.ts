import { ApiProperty } from '@nestjs/swagger';
import { Forecast } from '../../modules/data-service/providers/WeatherDataService';

export class WeatherForecastResponse implements Forecast {
  @ApiProperty({ type: String })
  area!: string;

  @ApiProperty({ type: String })
  forecast!: string;
}
