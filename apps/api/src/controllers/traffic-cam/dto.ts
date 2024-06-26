import { ApiProperty } from '@nestjs/swagger';
import { TrafficCamData as TrafficCamDataI } from '../../modules/data-service/providers/TrafficCamDataService';

class GeoLocation {
  @ApiProperty({ type: Number })
  lat: number;

  @ApiProperty({ type: Number })
  lng: number;

  @ApiProperty({ type: String })
  name: string;
}

class ImageMetadata {
  @ApiProperty({ required: false, type: Number })
  width?: number;

  @ApiProperty({ required: false, type: Number })
  height?: number;

  @ApiProperty({ required: false, type: String })
  md5?: string;
}

class Image {
  @ApiProperty({ type: String })
  src: string;

  @ApiProperty({ type: ImageMetadata })
  metadata: ImageMetadata;
}

class TrafficCamData implements TrafficCamDataI {
  @ApiProperty({ type: String })
  cameraId!: string;

  @ApiProperty({ type: String })
  cursor!: string;

  @ApiProperty({ type: Image })
  image!: Image;

  @ApiProperty({ type: GeoLocation })
  location!: GeoLocation;
}

export class TrafficCamDataResponse {
  @ApiProperty({ type: String })
  timestamp: string;

  @ApiProperty({ type: [TrafficCamData] })
  cameras: TrafficCamData[];
}
