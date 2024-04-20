import { Module } from '@nestjs/common';
import { ReverseGeocodingService } from './providers/abstract';
import { GovSgApiReverseGeocoding } from './providers/GovSgApiReverseGeocoding';
import { DataServiceModule } from '../data-service/module';
import { CacheServiceModule } from '../cache/module';

@Module({
  imports: [DataServiceModule, CacheServiceModule],
  providers: [
    {
      provide: ReverseGeocodingService,
      useClass: GovSgApiReverseGeocoding,
      // useClass: GoogleReverseReverseGeocoding // need to pay :P
    },
  ],
  exports: [ReverseGeocodingService],
})
export class ReverseGeocodingModule {}
