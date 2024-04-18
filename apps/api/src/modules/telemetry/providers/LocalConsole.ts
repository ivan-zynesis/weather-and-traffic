import { Telemetry } from './type';
import { Injectable } from '@nestjs/common';

/**
 * Should be used for dev and test purpose only.
 * Application telemetry should stream logs to persistence or external service provider.
 */
@Injectable()
export class LocalConsole extends Telemetry {
  tags: string;
  constructor() {
    super();
    this.tags = '';
  }

  async tag(tag: string): Promise<void> {
    this.tags = `${this.tags}/${tag}`;
  }

  private prefix(message: string): string {
    return `${this.tags} :: ${message}`;
  }

  async debug(message: string): Promise<void> {
    console.debug(this.prefix(message));
  }

  async error(error: string | Error): Promise<void> {
    const message = typeof error === 'string' ? error : JSON.stringify(error);
    console.error(this.prefix(message));
  }

  async log(message: string): Promise<void> {
    console.log(this.prefix(message));
  }
}
