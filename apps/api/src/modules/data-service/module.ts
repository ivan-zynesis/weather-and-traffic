import { Module } from '@nestjs/common';
import { TelemetryModule } from '../telemetry/module';
import { WeatherDataService } from './providers/WeatherDataService';
import { GovSgApi } from './providers/GovSgApi';
import { TrafficCamDataService } from './providers/TrafficCamDataService';
import { GeoLocationDataService } from './providers/GeoLocationDataService';
import { CacheServiceModule } from '../cache/module';

@Module({
  imports: [TelemetryModule, CacheServiceModule],
  // providers implementation should be able to mix and match
  providers: [
    {
      provide: TrafficCamDataService,
      useClass: GovSgApi,
    },
    {
      provide: WeatherDataService,
      useClass: GovSgApi,
    },
    {
      provide: GeoLocationDataService,
      useClass: GovSgApi,
    },
  ],
  exports: [TrafficCamDataService, WeatherDataService, GeoLocationDataService],
})
export class DataServiceModule {}
