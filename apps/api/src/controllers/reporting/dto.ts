import { ApiProperty } from '@nestjs/swagger';

export class TimeSeriesMostQueriedResponse {
  @ApiProperty({ type: String })
  type: string;

  @ApiProperty({ type: String })
  selectedDateTime: string;
}
