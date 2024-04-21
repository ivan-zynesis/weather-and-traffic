import { Controller, Get, Inject, Param, Query } from '@nestjs/common';
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
import { GeoLocationQueryEntity } from '../../entities/GeoLocationQuery';
import {
  BaseQueryEntity,
  SupportedQueryType,
} from '../../entities/abstract/BaseQuery';

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
  @Get('/recent/:api')
  async recentQueries(
    @Param('api') api: string,
  ): Promise<RecentQueriedParameterResponse> {
    const spec = getQuerySpec(api);
    const mostQueriedTimestamps =
      await this.recentQueriesAnalytic.getRecentQueries(
        spec.entityClass,
        spec.field,
      );
    return {
      queriedParameters: mostQueriedTimestamps.map((ts) => ({
        queriedParameterValue: ts[spec.field].toString(),
        createdAt: ts.createdAt,
      })),
    };
  }

  @ApiResponse({ type: TopQueriedParameterResponse })
  @Get('/top/:api')
  async topQueries(
    @Param('api') api: string,
    @Query('start') start: string,
    @Query('end') end: string,
  ): Promise<TopQueriedParameterResponse> {
    const spec = getQuerySpec(api);
    const mostQueriedTimestamps = await this.topQueriesAnalytic.getTopQueries(
      spec.entityClass,
      spec.field,
      start,
      end,
    );
    return {
      topQueriedParameters: mostQueriedTimestamps.map((ts) => ({
        queriedParameterValue: ts[spec.field].toString(),
        count: ts.count,
      })),
    };
  }
}

function getQuerySpec<E extends BaseQueryEntity, Key extends keyof E>(
  api: string,
): { entityClass: new () => E; field: Key } {
  let ent: new () => BaseQueryEntity;
  let field: string;
  switch (api) {
    case 'traffic-cam' as SupportedQueryType:
      ent = TimeSeriesQueryEntity;
      field = 'selectedDateTime';
      break;
    case 'weather-forecast' as SupportedQueryType:
      ent = GeoLocationQueryEntity;
      field = 'latLng';
      break;
    default:
      throw new Error('Unknown API type');
  }

  return { entityClass: ent as any, field: field as any };
}
