import { Controller, Get, Query } from '@nestjs/common';
import { TrafficCamDataResponse } from './dto';
import { ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { TrafficCamDataService } from '../../modules/data-service/providers/TrafficCamDataService';
import { ReverseGeocodingService } from '../../modules/reverse-geocoding/providers/abstract';

@ApiTags('traffic-cam')
@Controller()
export class TrafficCamController {
  constructor(
    private readonly dataService: TrafficCamDataService,
    private readonly reverseGeocodingService: ReverseGeocodingService,
  ) {}

  @ApiQuery({ name: 'date_time', required: false, type: String })
  @ApiResponse({ type: TrafficCamDataResponse })
  @Get('traffic-cameras')
  async get(
    @Query('date_time') cursor?: string,
  ): Promise<TrafficCamDataResponse> {
    const data = await this.dataService.query(cursor);

    // reverse geocoding, need to think deeper for more performant solution
    const withLocation: TrafficCamDataResponse['cameras'] = await Promise.all(
      data.map(async (trafficCam) => ({
        ...trafficCam,
        location: {
          ...trafficCam.location,
          name: await this.reverseGeocodingService.lookup(trafficCam.location),
        },
      })),
    );

    return {
      timestamp: data[data.length - 1]?.cursor,
      cameras: withLocation,
    };
  }
}
