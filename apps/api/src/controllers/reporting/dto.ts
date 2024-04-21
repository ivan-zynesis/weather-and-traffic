import { ApiProperty } from '@nestjs/swagger';

export class TimeSeriesMostQueriedResponse {
  @ApiProperty({
    type: String,
    description: `Queries type, eg "traffic-camera`,
  })
  type: string;

  @ApiProperty({ type: String, description: `Queried parameter's value` })
  selectedDateTime: string;
}

export class RecentQueriedParameter {
  @ApiProperty({ type: String, description: `Queried parameter's value` })
  queriedParameterValue: string;

  @ApiProperty({
    type: Date,
    description: `When was the query request received`,
  })
  createdAt: Date;
}

export class RecentQueriedParameterResponse {
  @ApiProperty({ type: [RecentQueriedParameter] })
  queriedParameters: RecentQueriedParameter[];
}

export class TopQueriedParameter {
  @ApiProperty({ type: String, description: `Queried parameter's value` })
  queriedParameterValue: string;

  @ApiProperty({ type: Number, description: 'Query received count' })
  count: number;
}

export class TopQueriedParameterResponse {
  @ApiProperty({ type: [TopQueriedParameter] })
  topQueriedParameters: TopQueriedParameter[];
}
