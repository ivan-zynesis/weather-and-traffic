import { Module } from '@nestjs/common';
import { TrafficCamDataService } from './providers/type';
import { GovSgApi } from './providers/GovSgApi';
import { TelemetryModule } from '../telemetry/module';
import { Telemetry } from '../telemetry/providers/type';

@Module({
  imports: [TelemetryModule],
  providers: [
    {
      provide: TrafficCamDataService,
      useFactory: (telemetry: Telemetry) => new GovSgApi(telemetry),
      inject: [Telemetry],
    },
  ],
  exports: [TrafficCamDataService],
})
export class TrafficCamDataServiceModule {}
