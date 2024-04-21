import { MigrationInterface, QueryRunner } from 'typeorm';

export class Init1713692450678 implements MigrationInterface {
  name = 'Init1713692450678';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "geo_location_query_entity" ("createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "queryId" uuid NOT NULL DEFAULT uuid_generate_v4(), "location" text NOT NULL, "latitude" numeric NOT NULL, "longitude" numeric NOT NULL, "type" text NOT NULL, "metadata" jsonb NOT NULL, CONSTRAINT "PK_1dc42e0d3184dc08b7ed1499aaf" PRIMARY KEY ("queryId"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "time_series_query_entity" ("createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "queryId" uuid NOT NULL DEFAULT uuid_generate_v4(), "selectedDateTime" TIMESTAMP WITH TIME ZONE NOT NULL, "type" text NOT NULL, CONSTRAINT "PK_abeb311a41e74e0de7b63b41988" PRIMARY KEY ("queryId"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_TimeSeriesQuery-type/selectedDateTime" ON "time_series_query_entity" ("type", "selectedDateTime") `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX "IDX_TimeSeriesQuery-type/selectedDateTime"`,
    );
    await queryRunner.query(`DROP TABLE "time_series_query_entity"`);
    await queryRunner.query(`DROP TABLE "geo_location_query_entity"`);
  }
}
