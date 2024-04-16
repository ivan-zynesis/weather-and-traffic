import { Controller, Get } from '@nestjs/common';
import { Status, StatusesResponse } from './dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Status')
@Controller()
export class StatusController {
  constructor() {}

  @ApiResponse({ type: StatusesResponse })
  @Get('statuses')
  async status(): Promise<StatusesResponse> {
    return {
      main: Status.OK,
      // TODO: external API provider health probes
    };
  }
}
