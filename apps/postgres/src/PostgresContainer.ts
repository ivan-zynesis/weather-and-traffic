import {
  PostgreSqlContainer,
  StartedPostgreSqlContainer,
} from "@testcontainers/postgresql";

export interface PostgresConfig {
  userName: string;
  password: string;
  port: number;
}

export const DefaultDevPostgresConfig: PostgresConfig = {
  userName: "DEV_PSQL_USER",
  password: "DEV_PSQL_PASSWORD",
  port: 5432,
};

/**
 * Spin up a testcontainer for automated (jest) use
 */
export async function orchestratePsqlContainer(
  config: PostgresConfig = DefaultDevPostgresConfig,
): Promise<StartedPostgreSqlContainer> {
  const postgresContainer = await new PostgreSqlContainer()
    .withUsername(config.userName)
    .withPassword(config.password)
    .withExposedPorts(config.port)
    .start();

  return postgresContainer;
}
