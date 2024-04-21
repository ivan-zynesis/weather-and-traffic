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
  userName: "dev-db-user",
  password: "dev-db-password",
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
