import { Injectable } from '@nestjs/common';

@Injectable()
export abstract class Telemetry {
  abstract tag(tag: string): Promise<void>;
  abstract log(message: string): Promise<void>;
  abstract error(error: string | Error): Promise<void>;
  abstract debug(message: string): Promise<void>;
}
