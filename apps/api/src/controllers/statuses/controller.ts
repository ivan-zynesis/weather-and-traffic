import { Controller, Get } from '@nestjs/common';
import { Status, StatusesResponse } from './dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { DataSource } from 'typeorm';

@ApiTags('Status')
@Controller()
export class StatusController {
  constructor(private readonly dataSource: DataSource) {}

  @ApiResponse({ type: StatusesResponse })
  @Get('statuses')
  async status(): Promise<StatusesResponse> {
    return {
      main: Status.OK,
      db: this.dataSource.isInitialized ? Status.OK : Status.DOWN,

      // TODO: external API provider health probes
    };
  }
}
