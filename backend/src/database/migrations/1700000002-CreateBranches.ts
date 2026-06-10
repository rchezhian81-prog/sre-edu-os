import { MigrationInterface, QueryRunner } from 'typeorm';
export class CreateBranches1700000002 implements MigrationInterface {
  name = 'CreateBranches1700000002';
  async up(runner: QueryRunner) {
    await runner.query(`CREATE TYPE "status_enum" AS ENUM ('active','inactive','archived')`);
    await runner.query(`
      CREATE TABLE "branches" (
        "id"             UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
        "name"           VARCHAR     NOT NULL,
        "code"           VARCHAR,
        "address"        TEXT,
        "city"           VARCHAR,
        "state"          VARCHAR,
        "pincode"        VARCHAR,
        "phone"          VARCHAR,
        "email"          VARCHAR,
        "principal_name" VARCHAR,
        "status"         status_enum NOT NULL DEFAULT 'active',
        "settings"       JSONB,
        "is_deleted"     BOOLEAN     NOT NULL DEFAULT false,
        "deleted_at"     TIMESTAMPTZ,
        "created_by"     UUID,
        "updated_by"     UUID,
        "created_at"     TIMESTAMPTZ NOT NULL DEFAULT now(),
        "updated_at"     TIMESTAMPTZ NOT NULL DEFAULT now(),
        CONSTRAINT "uq_branches_name" UNIQUE ("name")
      )
    `);
    await runner.query(`INSERT INTO "branches"("name","code","city","status") VALUES ('Main Campus','MC001','Hyderabad','active')`);
  }
  async down(runner: QueryRunner) {
    await runner.query(`DROP TABLE "branches"`);
    await runner.query(`DROP TYPE "status_enum"`);
  }
}
