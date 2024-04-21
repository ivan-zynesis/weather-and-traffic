import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TimeSeriesQueryAnalytic } from './providers/TimeSeriesQueryAnalytic';
import { TimeSeriesQueryEntity } from '../../entities/TimeSeriesQuery';
import { RecentQueriesAnalytic } from './providers/RecentQueriesAnalytic';
import { TopQueriesAnalytic } from './providers/TopQueriesAnalytic';
import { GeoLocationQueryEntity } from '../../entities/GeoLocationQuery';
import { QueryLogger } from './providers/QueryLogger';

export const RecentQueriesAnalyticService = 'RecentQueriesAnalyticService';
export const TopQueriesAnalyticService = 'TopQueriesAnalyticService';
export const TimeSeriesQueryAnalyticService = 'TimeSeriesQueryAnalyticService';

@Module({
  imports: [
    TypeOrmModule.forFeature([TimeSeriesQueryEntity, GeoLocationQueryEntity]),
  ],
  providers: [
    QueryLogger,
    {
      provide: RecentQueriesAnalyticService,
      useClass: RecentQueriesAnalytic,
    },
    {
      provide: TopQueriesAnalyticService,
      useClass: TopQueriesAnalytic,
    },
    {
      provide: TimeSeriesQueryAnalyticService,
      useClass: TimeSeriesQueryAnalytic,
    },
  ],
  exports: [
    QueryLogger,
    RecentQueriesAnalyticService,
    TopQueriesAnalyticService,
    TimeSeriesQueryAnalyticService,
  ],
})
export class ReportingModule {}
