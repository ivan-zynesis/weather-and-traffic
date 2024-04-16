import { Controller, Get } from '@nestjs/common';

type Status = 'OK' | 'DOWN';

@Controller()
export class AppController {
  constructor() {}

  @Get('status')
  status(): Record<string, Status> {
    return {
      main: 'OK',
      // TODO: external API provider health probes
    };
  }
}
