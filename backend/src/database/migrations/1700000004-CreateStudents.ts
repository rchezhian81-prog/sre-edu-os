import { MigrationInterface, QueryRunner } from 'typeorm';
export class CreateStudents1700000004 implements MigrationInterface {
  name = 'CreateStudents1700000004';
  async up(runner: QueryRunner) {
    await runner.query(`CREATE TYPE "gender_enum" AS ENUM ('male','female','other')`);
    await runner.query(`
      CREATE TABLE "students" (
        "id"             UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
        "branch_id"      UUID          NOT NULL REFERENCES "branches"("id"),
        "class_id"       UUID          REFERENCES "classes"("id"),
        "section_id"     UUID          REFERENCES "sections"("id"),
        "admission_no"   VARCHAR       NOT NULL,
        "roll_no"        VARCHAR,
        "full_name"      VARCHAR       NOT NULL,
        "gender"         gender_enum,
        "date_of_birth"  DATE,
        "parent_name"    VARCHAR,
        "parent_phone"   VARCHAR,
        "parent_email"   VARCHAR,
        "address"        TEXT,
        "blood_group"    VARCHAR,
        "photo_url"      VARCHAR,
        "admission_date" DATE,
        "status"         status_enum   NOT NULL DEFAULT 'active',
        "extra_info"     JSONB,
        "is_deleted"     BOOLEAN       NOT NULL DEFAULT false,
        "deleted_at"     TIMESTAMPTZ,
        "created_by"     UUID,
        "updated_by"     UUID,
        "created_at"     TIMESTAMPTZ   NOT NULL DEFAULT now(),
        "updated_at"     TIMESTAMPTZ   NOT NULL DEFAULT now(),
        CONSTRAINT "uq_students_admno_branch" UNIQUE ("admission_no","branch_id")
      )
    `);
    await runner.query(`CREATE INDEX "idx_students_branch"  ON "students"("branch_id")`);
    await runner.query(`CREATE INDEX "idx_students_class"   ON "students"("class_id")`);
    await runner.query(`CREATE INDEX "idx_students_section" ON "students"("section_id")`);
    await runner.query(`CREATE INDEX "idx_students_name"    ON "students"("full_name")`);
  }
  async down(runner: QueryRunner) {
    await runner.query(`DROP TABLE "students"`);
    await runner.query(`DROP TYPE "gender_enum"`);
  }
}
