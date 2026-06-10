import { MigrationInterface, QueryRunner } from 'typeorm';
export class CreateExam1700000008 implements MigrationInterface {
  name = 'CreateExam1700000008';
  async up(runner: QueryRunner) {
    await runner.query(`CREATE TYPE "exam_type_enum" AS ENUM ('unit_test','midterm','annual','practical','internal')`);
    await runner.query(`
      CREATE TABLE "exam_schedules" (
        "id"              UUID           PRIMARY KEY DEFAULT gen_random_uuid(),
        "branch_id"       UUID           NOT NULL REFERENCES "branches"("id"),
        "class_id"        UUID           REFERENCES "classes"("id"),
        "exam_type"       exam_type_enum NOT NULL,
        "name"            VARCHAR        NOT NULL,
        "academic_year"   VARCHAR        NOT NULL,
        "term"            VARCHAR,
        "start_date"      DATE,
        "end_date"        DATE,
        "subject_schedule" JSONB,
        "is_deleted"      BOOLEAN        NOT NULL DEFAULT false,
        "deleted_at"      TIMESTAMPTZ,
        "created_by"      UUID,
        "updated_by"      UUID,
        "created_at"      TIMESTAMPTZ    NOT NULL DEFAULT now(),
        "updated_at"      TIMESTAMPTZ    NOT NULL DEFAULT now()
      )
    `);
    await runner.query(`
      CREATE TABLE "exam_results" (
        "id"                 UUID    PRIMARY KEY DEFAULT gen_random_uuid(),
        "student_id"         UUID    NOT NULL REFERENCES "students"("id"),
        "branch_id"          UUID    NOT NULL REFERENCES "branches"("id"),
        "exam_schedule_id"   UUID    NOT NULL REFERENCES "exam_schedules"("id"),
        "subject_id"         UUID    NOT NULL REFERENCES "subjects"("id"),
        "marks_theory"       NUMERIC(5,2),
        "marks_practical"    NUMERIC(5,2),
        "total_marks"        NUMERIC(5,2),
        "grade"              VARCHAR,
        "is_absent"          BOOLEAN NOT NULL DEFAULT false,
        "remarks"            VARCHAR,
        "entered_by"         UUID    REFERENCES "users"("id"),
        "is_deleted"         BOOLEAN NOT NULL DEFAULT false,
        "deleted_at"         TIMESTAMPTZ,
        "created_by"         UUID,
        "updated_by"         UUID,
        "created_at"         TIMESTAMPTZ NOT NULL DEFAULT now(),
        "updated_at"         TIMESTAMPTZ NOT NULL DEFAULT now(),
        CONSTRAINT "uq_exam_result" UNIQUE ("student_id","exam_schedule_id","subject_id")
      )
    `);
    await runner.query(`CREATE INDEX "idx_exam_results_student" ON "exam_results"("student_id")`);
    await runner.query(`CREATE INDEX "idx_exam_results_exam"    ON "exam_results"("exam_schedule_id")`);
  }
  async down(runner: QueryRunner) {
    await runner.query(`DROP TABLE "exam_results"`);
    await runner.query(`DROP TABLE "exam_schedules"`);
    await runner.query(`DROP TYPE "exam_type_enum"`);
  }
}
