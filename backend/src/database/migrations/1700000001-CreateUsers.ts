import { MigrationInterface, QueryRunner } from 'typeorm';
export class CreateUsers1700000001 implements MigrationInterface {
  name = 'CreateUsers1700000001';
  async up(runner: QueryRunner) {
    await runner.query(`CREATE TYPE "role_enum" AS ENUM ('owner','admin','principal','teacher','parent','student','accountant','librarian','transport_officer')`);
    await runner.query(`
      CREATE TABLE "users" (
        "id"            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
        "full_name"     VARCHAR     NOT NULL,
        "email"         VARCHAR     NOT NULL,
        "password_hash" VARCHAR     NOT NULL,
        "role"          role_enum   NOT NULL,
        "phone"         VARCHAR,
        "avatar_url"    VARCHAR,
        "is_active"     BOOLEAN     NOT NULL DEFAULT true,
        "branch_id"     UUID,
        "permissions"   JSONB,
        "last_login_at" TIMESTAMPTZ,
        "is_deleted"    BOOLEAN     NOT NULL DEFAULT false,
        "deleted_at"    TIMESTAMPTZ,
        "created_by"    UUID,
        "updated_by"    UUID,
        "created_at"    TIMESTAMPTZ NOT NULL DEFAULT now(),
        "updated_at"    TIMESTAMPTZ NOT NULL DEFAULT now(),
        CONSTRAINT "uq_users_email" UNIQUE ("email")
      )
    `);
    await runner.query(`CREATE INDEX "idx_users_email" ON "users"("email")`);
    await runner.query(`CREATE INDEX "idx_users_branch" ON "users"("branch_id")`);
    await runner.query(`CREATE INDEX "idx_users_role"   ON "users"("role")`);

    -- Seed default owner
    await runner.query(`
      INSERT INTO "users"("full_name","email","password_hash","role","is_active") VALUES
      ('Owner Admin','owner@sreedos.com','$2b$12$placeholder_bcrypt_hash','owner',true)
    `);
  }
  async down(runner: QueryRunner) {
    await runner.query(`DROP TABLE "users"`);
    await runner.query(`DROP TYPE "role_enum"`);
  }
}
