import { MigrationInterface, QueryRunner } from 'typeorm';
export class CreateStaff1700000005 implements MigrationInterface {
  name = 'CreateStaff1700000005';
  async up(runner: QueryRunner) {
    await runner.query(`
      CREATE TABLE "staff" (
        "id"                UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
        "branch_id"         UUID        NOT NULL REFERENCES "branches"("id"),
        "user_id"           UUID        REFERENCES "users"("id"),
        "employee_id"       VARCHAR     NOT NULL,
        "full_name"         VARCHAR     NOT NULL,
        "designation"       VARCHAR,
        "department"        VARCHAR,
        "gender"            gender_enum,
        "phone"             VARCHAR,
        "email"             VARCHAR,
        "qualification"     VARCHAR,
        "join_date"         DATE,
        "salary"            NUMERIC(10,2),
        "photo_url"         VARCHAR,
        "subjects_assigned" JSONB,
        "status"            status_enum NOT NULL DEFAULT 'active',
        "is_deleted"        BOOLEAN     NOT NULL DEFAULT false,
        "deleted_at"        TIMESTAMPTZ,
        "created_by"        UUID,
        "updated_by"        UUID,
        "created_at"        TIMESTAMPTZ NOT NULL DEFAULT now(),
        "updated_at"        TIMESTAMPTZ NOT NULL DEFAULT now()
      )
    `);
    await runner.query(`CREATE INDEX "idx_staff_branch" ON "staff"("branch_id")`);
    await runner.query(`CREATE INDEX "idx_staff_user"   ON "staff"("user_id")`);
  }
  async down(runner: QueryRunner) { await runner.query(`DROP TABLE "staff"`); }
}
