import { ApiProperty } from '@nestjs/swagger';

export enum Status {
  OK = 'OK',
  DOWN = 'DOWN',
}

export class StatusesResponse {
  @ApiProperty({ required: true, enum: Status })
  main: Status;

  // other external dependencies provider health status
}
