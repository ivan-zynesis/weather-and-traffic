import { Module } from '@nestjs/common';
import { StatusController } from './controllers/statuses/controller';

@Module({
  imports: [],
  controllers: [StatusController],
  providers: [],
})
export class AppModule {}
