import { Controller, Get, Query } from '@nestjs/common';
import { TrafficCamDataResponse } from './dto';
import { ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { TrafficCamDataService } from '../../modules/tranffic-cam-data-service/providers/type';

@ApiTags('traffic-cam')
@Controller()
export class TrafficCamController {
  constructor(private readonly dataService: TrafficCamDataService) {}

  @ApiQuery({ name: 'date_time', required: false, type: String })
  @ApiResponse({ type: TrafficCamDataResponse })
  @Get('traffic-cameras')
  async get(
    @Query('date_time') cursor?: string,
  ): Promise<TrafficCamDataResponse> {
    const data = await this.dataService.query(cursor);
    return {
      timestamp: data[data.length - 1]?.cursor,
      cameras: data,
    };
  }
}
