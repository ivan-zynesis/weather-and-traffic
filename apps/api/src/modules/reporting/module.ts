import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TimeSeriesQueryAnalytic } from './providers/TimeSeriesQueryAnalytic';
import { TimeSeriesQueryEntity } from '../../entities/TimeSeriesQuery';

export const TimeSeriesQueryAnalyticService = 'TimeSeriesQueryAnalyticService';

@Module({
  imports: [TypeOrmModule.forFeature([TimeSeriesQueryEntity])],
  providers: [
    {
      provide: TimeSeriesQueryAnalyticService,
      useClass: TimeSeriesQueryAnalytic,
    },
  ],
  exports: [TimeSeriesQueryAnalyticService],
})
export class ReportingModule {}
