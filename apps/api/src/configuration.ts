import * as process from 'node:process';

const DefaultDevPostgresConfig = {
  userName: 'dev-db-user',
  password: 'dev-db-password',
  database: 'dev-db',
  port: 5432,
};

export const configuration = () => ({
  NODE_ENV: process.env.NODE_ENV ?? 'DEVELOPMENT',
  db: {
    host: process.env.DB_HOST ?? 'localhost',
    database: process.env.DB_DATABASE ?? DefaultDevPostgresConfig.database,
    user: process.env.DB_USER ?? DefaultDevPostgresConfig.userName,
    password: process.env.DB_PASSWORD ?? DefaultDevPostgresConfig.password,
    port: process.env.DB_PORT
      ? parseInt(process.env.DB_PORT)
      : DefaultDevPostgresConfig.port,
  },
  apiKeys: {
    google: {
      reverseGeocoding: process.env.GOOGLE_REV_GEOCODING_API_KEY,
    },
  },
});
