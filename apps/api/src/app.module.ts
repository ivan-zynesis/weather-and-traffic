import { Module } from '@nestjs/common';
import { StatusController } from './controllers/statuses/controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { configuration } from './configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get('db.host'),
        port: config.get<number>('db.port'),
        database: config.get('db.database'),
        username: config.get('db.user'),
        password: config.get('db.password'),
        entities: [],
        // TODO: db migration
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [StatusController],
  providers: [],
})
export class AppModule {}
