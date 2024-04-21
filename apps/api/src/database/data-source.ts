import { DataSource } from 'typeorm';
import { GeoLocationQueryEntity } from '../entities/GeoLocationQuery';
import { TimeSeriesQueryEntity } from '../entities/TimeSeriesQuery';

export default new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'dev-db-user',
  password: 'dev-db-password',
  database: 'dev-db',
  synchronize: false,
  logging: false,
  entities: [GeoLocationQueryEntity, TimeSeriesQueryEntity],
  migrations: [],
  subscribers: [],
});
