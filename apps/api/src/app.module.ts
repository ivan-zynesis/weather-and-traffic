import { Module } from '@nestjs/common';
import { StatusController } from './controllers/statuses/controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { configuration } from './configuration';
import { TrafficCamController } from './controllers/traffic-cam/controller';
import { TelemetryModule } from './modules/telemetry/module';
import { DataServiceModule } from './modules/data-service/module';
import { WeatherForecastController } from './controllers/weather-forecast/controller';
import { CacheServiceModule } from './modules/cache/module';
import { ReverseGeocodingModule } from './modules/reverse-geocoding/module';
import { TimeSeriesQueryEntity } from './entities/TimeSeriesQuery';
import { GeoLocationQueryEntity } from './entities/GeoLocationQuery';
import { ReportingModule } from './modules/reporting/module';

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
        entities: [TimeSeriesQueryEntity, GeoLocationQueryEntity],
        // TODO: db migration
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    CacheServiceModule,
    TelemetryModule,
    DataServiceModule,
    ReverseGeocodingModule,
    ReportingModule,
  ],
  controllers: [
    StatusController,
    TrafficCamController,
    WeatherForecastController,
  ],
  providers: [],
})
export class AppModule {}
