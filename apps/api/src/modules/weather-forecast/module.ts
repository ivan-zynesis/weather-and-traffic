import { Module } from '@nestjs/common';
import { DataServiceModule } from '../data-service/module';
import { ReverseGeocodingModule } from '../reverse-geocoding/module';
import { WeatherForecastService } from './providers/WeatherForecastService';

@Module({
  imports: [DataServiceModule, ReverseGeocodingModule],
  providers: [WeatherForecastService],
  exports: [WeatherForecastService],
})
export class WeatherForecastModule {}
