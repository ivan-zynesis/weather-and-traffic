import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TimeSeriesQueryAnalytic } from './providers/TimeSeriesQueryAnalytic';
import { TimeSeriesQueryEntity } from '../../entities/TimeSeriesQuery';
import { RecentQueriesAnalytic } from './providers/RecentQueriesAnalytic';

export const RecentQueriesAnalyticService = 'RecentQueriesAnalyticService';
export const TimeSeriesQueryAnalyticService = 'TimeSeriesQueryAnalyticService';

@Module({
  imports: [TypeOrmModule.forFeature([TimeSeriesQueryEntity])],
  providers: [
    {
      provide: RecentQueriesAnalyticService,
      useClass: RecentQueriesAnalytic,
    },
    {
      provide: TimeSeriesQueryAnalyticService,
      useClass: TimeSeriesQueryAnalytic,
    },
  ],
  exports: [TimeSeriesQueryAnalyticService],
})
export class ReportingModule {}
