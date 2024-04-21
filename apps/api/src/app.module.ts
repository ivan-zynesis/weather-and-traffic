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
import { migrations } from './database/migrations';
import { ReportingController } from './controllers/reporting/controller';
import { WeatherForecastModule } from './modules/weather-forecast/module';

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
        migrationsRun: true,
        migrations,
      }),
      inject: [ConfigService],
    }),
    CacheServiceModule,
    TelemetryModule,
    DataServiceModule,
    ReverseGeocodingModule,
    ReportingModule,
    WeatherForecastModule,
  ],
  controllers: [
    StatusController,
    TrafficCamController,
    WeatherForecastController,
    ReportingController,
  ],
  providers: [],
})
export class AppModule {}
