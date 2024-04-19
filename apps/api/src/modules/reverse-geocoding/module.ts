import { Module } from '@nestjs/common';
import { ReverseGeocodingService } from './providers/abstract';
import { GovSgApiReverseGeocoding } from './providers/GovSgApiReverseGeocoding';
import { DataServiceModule } from '../data-service/module';

@Module({
  imports: [DataServiceModule],
  providers: [
    {
      provide: ReverseGeocodingService,
      useClass: GovSgApiReverseGeocoding,
    },
  ],
  exports: [ReverseGeocodingService],
})
export class ReverseGeocodingModule {}
