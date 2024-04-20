import { Controller, Get, Query } from '@nestjs/common';
import { ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { TimeSeriesMostQueriedResponse } from './dto';
import { TimeSeriesQueryAnalytic } from '../../modules/reporting/providers/TimeSeriesQueryAnalytic';

@ApiTags('Reporting')
@Controller('reporting')
export class ReportingController {
  constructor(private readonly timeSeries: TimeSeriesQueryAnalytic) {}

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
  @Get('/time-series/most-queried')
  async status(
    @Query('start') start: string,
    @Query('end') end: string,
  ): Promise<TimeSeriesMostQueriedResponse> {
    const onlySupportedTypeAtm = 'traffic-cam';
    const mostQueriedTimestamp = await this.timeSeries.selectMostQueried(
      onlySupportedTypeAtm,
      start,
      end,
    );
    return {
      type: onlySupportedTypeAtm,
      selectedDateTime: mostQueriedTimestamp,
    };
  }
}
