import { Controller, Get, Query } from '@nestjs/common';
import { WeatherForecastResponse } from './dto';
import { ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Coordinate } from '../../modules/reverse-geocoding/providers/abstract';
import { WeatherForecastService } from '../../modules/weather-forecast/providers/WeatherForecastService';
import { QueryLogger } from '../../modules/reporting/providers/QueryLogger';
import { GeoLocationQueryEntity } from '../../entities/GeoLocationQuery';

@ApiTags('Weather Forecasts')
@Controller()
export class WeatherForecastController {
  constructor(
    private readonly service: WeatherForecastService,
    private readonly queryLogger: QueryLogger,
  ) {}

  @ApiQuery({
    name: 'coordinate',
    required: true,
    type: String,
    description: '<lat>,<lng>',
  })
  @ApiResponse({ type: WeatherForecastResponse })
  @Get('weather-forecast')
  async get(
    @Query('coordinate') latLng: string,
  ): Promise<WeatherForecastResponse> {
    const coordinate = validateCoordinate(latLng);
    try {
      const forecast = await this.service.getForecast(coordinate);
      await this.queryLogger.log(GeoLocationQueryEntity, {
        type: 'weather-forecast',
        location: forecast.area,
        latLng,
      });
      return forecast;
    } catch (e: any) {
      await this.queryLogger.log(GeoLocationQueryEntity, {
        type: 'weather-forecast',
        latLng,
      });
      throw e;
    }
  }
}

/**
 * TODO proper validation pipe
 */
function validateCoordinate(latLng: string): Coordinate {
  const split = latLng.split(',');
  if (split.length !== 2) {
    throw new Error('InvalidParam');
  }
  const [lat, lng] = split;
  return {
    lat: parseFloat(lat),
    lng: parseFloat(lng),
  };
}
