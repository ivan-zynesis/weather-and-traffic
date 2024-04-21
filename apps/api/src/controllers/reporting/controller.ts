import { Controller, Get, Inject, Query } from '@nestjs/common';
import { ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  RecentQueriedParameterResponse,
  TimeSeriesMostQueriedResponse,
  TopQueriedParameterResponse,
} from './dto';
import { TimeSeriesQueryAnalytic } from '../../modules/reporting/providers/TimeSeriesQueryAnalytic';
import { TimeSeriesQueryEntity } from '../../entities/TimeSeriesQuery';
import { RecentQueriesAnalytic } from '../../modules/reporting/providers/RecentQueriesAnalytic';
import {
  RecentQueriesAnalyticService,
  TimeSeriesQueryAnalyticService,
  TopQueriesAnalyticService,
} from '../../modules/reporting/module';
import { TopQueriesAnalytic } from '../../modules/reporting/providers/TopQueriesAnalytic';

@ApiTags('Reporting')
@Controller('reporting')
export class ReportingController {
  constructor(
    @Inject(TimeSeriesQueryAnalyticService)
    private readonly timeSeriesAnalytic: TimeSeriesQueryAnalytic,
    @Inject(RecentQueriesAnalyticService)
    private readonly recentQueriesAnalytic: RecentQueriesAnalytic,
    @Inject(TopQueriesAnalyticService)
    private readonly topQueriesAnalytic: TopQueriesAnalytic,
  ) {}

  @ApiQuery({
    name: 'start',
    type: String,
    description: 'date time iso string',
  })
  @ApiQuery({
    name: 'end',
    type: String,
    description: 'date time iso string',
  })
  @ApiResponse({ type: TimeSeriesMostQueriedResponse })
  @Get('/most-queried/traffic-camera-datetime')
  async highestQueriedParamWithMovingOneHourBlock(
    @Query('start') start: string,
    @Query('end') end: string,
  ): Promise<TimeSeriesMostQueriedResponse> {
    const onlySupportedTypeAtm = 'traffic-cam';
    const mostQueriedTimestamp =
      await this.timeSeriesAnalytic.selectMostQueried(
        onlySupportedTypeAtm,
        start,
        end,
      );
    return {
      type: onlySupportedTypeAtm,
      selectedDateTime: mostQueriedTimestamp,
    };
  }

  @ApiResponse({ type: TimeSeriesMostQueriedResponse })
  @Get('/recent/traffic-camera-datetime')
  async recentQueries(): Promise<RecentQueriedParameterResponse> {
    const onlySupportedTypeAtm = TimeSeriesQueryEntity;
    const mostQueriedTimestamps =
      await this.recentQueriesAnalytic.getRecentQueries(
        onlySupportedTypeAtm,
        'selectedDateTime',
      );
    return {
      queriedParameters: mostQueriedTimestamps.map((ts) => ({
        queriedParameterValue: ts.selectedDateTime.toISOString(),
        createdAt: ts.createdAt,
      })),
    };
  }

  @ApiResponse({ type: TopQueriedParameterResponse })
  @Get('/top/traffic-camera-datetime')
  async topQueries(
    @Query('start') start: string,
    @Query('end') end: string,
  ): Promise<TopQueriedParameterResponse> {
    const onlySupportedTypeAtm = TimeSeriesQueryEntity;
    const mostQueriedTimestamps = await this.topQueriesAnalytic.getTopQueries(
      onlySupportedTypeAtm,
      'selectedDateTime',
      start,
      end,
    );
    return {
      topQueriedParameters: mostQueriedTimestamps.map((ts) => ({
        queriedParameterValue: ts.selectedDateTime.toISOString(),
        count: ts.count,
      })),
    };
  }

  // TODO: top 10 queries params
}
