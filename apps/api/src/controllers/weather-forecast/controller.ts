import { Controller, Get, Query } from '@nestjs/common';
import { WeatherForecastResponse } from './dto';
import { ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { WeatherDataService } from '../../modules/data-service/providers/WeatherDataService';

@ApiTags('Weather Forecasts')
@Controller()
export class WeatherForecastController {
  constructor(private readonly dataService: WeatherDataService) {}

  @ApiQuery({ name: 'date_time', required: false, type: String })
  @ApiQuery({ name: 'date', required: false, type: String })
  @ApiResponse({ type: WeatherForecastResponse })
  @Get('weather-forecast')
  async get(
    @Query('date_time') dateTime?: string,
    @Query('date') date?: string,
  ): Promise<WeatherForecastResponse> {
    return this.dataService.getForecasts({
      date,
      date_time: dateTime,
    });
  }
}
