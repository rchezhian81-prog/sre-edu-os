import { MigrationInterface, QueryRunner } from 'typeorm';
export class CreateAttendance1700000006 implements MigrationInterface {
  name = 'CreateAttendance1700000006';
  async up(runner: QueryRunner) {
    await runner.query(`CREATE TYPE "att_status_enum" AS ENUM ('present','absent','late','half_day','leave')`);
    await runner.query(`
      CREATE TABLE "attendance" (
        "id"          UUID            PRIMARY KEY DEFAULT gen_random_uuid(),
        "student_id"  UUID            NOT NULL REFERENCES "students"("id"),
        "branch_id"   UUID            NOT NULL REFERENCES "branches"("id"),
        "class_id"    UUID            REFERENCES "classes"("id"),
        "section_id"  UUID            REFERENCES "sections"("id"),
        "marked_by"   UUID            REFERENCES "users"("id"),
        "date"        DATE            NOT NULL,
        "period_no"   INTEGER         NOT NULL DEFAULT 0,
        "status"      att_status_enum NOT NULL DEFAULT 'present',
        "remarks"     VARCHAR,
        "is_deleted"  BOOLEAN         NOT NULL DEFAULT false,
        "deleted_at"  TIMESTAMPTZ,
        "created_by"  UUID,
        "updated_by"  UUID,
        "created_at"  TIMESTAMPTZ     NOT NULL DEFAULT now(),
        "updated_at"  TIMESTAMPTZ     NOT NULL DEFAULT now(),
        CONSTRAINT "uq_att_student_date_period" UNIQUE ("student_id","date","period_no")
      )
    `);
    await runner.query(`CREATE INDEX "idx_att_student" ON "attendance"("student_id")`);
    await runner.query(`CREATE INDEX "idx_att_date"    ON "attendance"("date")`);
    await runner.query(`CREATE INDEX "idx_att_branch"  ON "attendance"("branch_id")`);
    await runner.query(`CREATE INDEX "idx_att_class"   ON "attendance"("class_id")`);
  }
  async down(runner: QueryRunner) {
    await runner.query(`DROP TABLE "attendance"`);
    await runner.query(`DROP TYPE "att_status_enum"`);
  }
}
