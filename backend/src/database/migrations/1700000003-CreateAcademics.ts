import { MigrationInterface, QueryRunner } from 'typeorm';
export class CreateAcademics1700000003 implements MigrationInterface {
  name = 'CreateAcademics1700000003';
  async up(runner: QueryRunner) {
    await runner.query(`
      CREATE TABLE "classes" (
        "id"            UUID    PRIMARY KEY DEFAULT gen_random_uuid(),
        "branch_id"     UUID    NOT NULL REFERENCES "branches"("id"),
        "name"          VARCHAR NOT NULL,
        "level"         INTEGER,
        "stream"        VARCHAR,
        "academic_year" VARCHAR,
        "is_deleted"    BOOLEAN NOT NULL DEFAULT false,
        "deleted_at"    TIMESTAMPTZ,
        "created_by"    UUID,
        "updated_by"    UUID,
        "created_at"    TIMESTAMPTZ NOT NULL DEFAULT now(),
        "updated_at"    TIMESTAMPTZ NOT NULL DEFAULT now()
      )
    `);
    await runner.query(`
      CREATE TABLE "sections" (
        "id"               UUID    PRIMARY KEY DEFAULT gen_random_uuid(),
        "branch_id"        UUID    NOT NULL REFERENCES "branches"("id"),
        "class_id"         UUID    NOT NULL REFERENCES "classes"("id"),
        "name"             VARCHAR NOT NULL,
        "class_teacher_id" UUID,
        "capacity"         INTEGER DEFAULT 40,
        "is_deleted"       BOOLEAN NOT NULL DEFAULT false,
        "deleted_at"       TIMESTAMPTZ,
        "created_by"       UUID,
        "updated_by"       UUID,
        "created_at"       TIMESTAMPTZ NOT NULL DEFAULT now(),
        "updated_at"       TIMESTAMPTZ NOT NULL DEFAULT now()
      )
    `);
    await runner.query(`
      CREATE TABLE "subjects" (
        "id"                    UUID    PRIMARY KEY DEFAULT gen_random_uuid(),
        "branch_id"             UUID    NOT NULL REFERENCES "branches"("id"),
        "name"                  VARCHAR NOT NULL,
        "code"                  VARCHAR,
        "type"                  VARCHAR DEFAULT 'theory',
        "max_marks_theory"      INTEGER DEFAULT 100,
        "max_marks_practical"   INTEGER DEFAULT 0,
        "pass_marks"            INTEGER DEFAULT 35,
        "is_deleted"            BOOLEAN NOT NULL DEFAULT false,
        "deleted_at"            TIMESTAMPTZ,
        "created_by"            UUID,
        "updated_by"            UUID,
        "created_at"            TIMESTAMPTZ NOT NULL DEFAULT now(),
        "updated_at"            TIMESTAMPTZ NOT NULL DEFAULT now()
      )
    `);
    await runner.query(`CREATE INDEX "idx_classes_branch"   ON "classes"("branch_id")`);
    await runner.query(`CREATE INDEX "idx_sections_class"   ON "sections"("class_id")`);
    await runner.query(`CREATE INDEX "idx_subjects_branch"  ON "subjects"("branch_id")`);
  }
  async down(runner: QueryRunner) {
    await runner.query(`DROP TABLE "subjects"`);
    await runner.query(`DROP TABLE "sections"`);
    await runner.query(`DROP TABLE "classes"`);
  }
}
