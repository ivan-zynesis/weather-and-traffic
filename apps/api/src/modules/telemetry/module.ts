import { Module } from '@nestjs/common';
import { Telemetry } from './providers/type';
import { LocalConsole } from './providers/LocalConsole';

@Module({
  providers: [
    {
      provide: Telemetry,
      // TODO: switch to some cloud logs streamer by envvar
      useClass: LocalConsole,
    },
  ],
  exports: [Telemetry],
})
export class TelemetryModule {}
