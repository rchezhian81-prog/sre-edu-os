import { MigrationInterface, QueryRunner } from 'typeorm';
export class CreateFees1700000007 implements MigrationInterface {
  name = 'CreateFees1700000007';
  async up(runner: QueryRunner) {
    await runner.query(`CREATE TYPE "fee_status_enum"   AS ENUM ('pending','paid','partial','overdue','waived')`);
    await runner.query(`CREATE TYPE "payment_mode_enum" AS ENUM ('cash','upi','card','netbanking','cheque','demand_draft')`);
    await runner.query(`
      CREATE TABLE "fee_structures" (
        "id"            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
        "branch_id"     UUID        NOT NULL REFERENCES "branches"("id"),
        "class_id"      UUID        REFERENCES "classes"("id"),
        "name"          VARCHAR     NOT NULL,
        "academic_year" VARCHAR     NOT NULL,
        "amount"        NUMERIC(10,2) NOT NULL,
        "frequency"     VARCHAR,
        "due_date"      VARCHAR,
        "components"    JSONB,
        "is_deleted"    BOOLEAN     NOT NULL DEFAULT false,
        "deleted_at"    TIMESTAMPTZ,
        "created_by"    UUID,
        "updated_by"    UUID,
        "created_at"    TIMESTAMPTZ NOT NULL DEFAULT now(),
        "updated_at"    TIMESTAMPTZ NOT NULL DEFAULT now()
      )
    `);
    await runner.query(`
      CREATE TABLE "fee_payments" (
        "id"                 UUID              PRIMARY KEY DEFAULT gen_random_uuid(),
        "student_id"         UUID              NOT NULL REFERENCES "students"("id"),
        "branch_id"          UUID              NOT NULL REFERENCES "branches"("id"),
        "fee_structure_id"   UUID              REFERENCES "fee_structures"("id"),
        "receipt_no"         VARCHAR           NOT NULL,
        "amount_due"         NUMERIC(10,2)     NOT NULL DEFAULT 0,
        "amount_paid"        NUMERIC(10,2)     NOT NULL DEFAULT 0,
        "discount"           NUMERIC(10,2)     NOT NULL DEFAULT 0,
        "late_fee"           NUMERIC(10,2)     NOT NULL DEFAULT 0,
        "status"             fee_status_enum   NOT NULL DEFAULT 'pending',
        "payment_mode"       payment_mode_enum,
        "transaction_id"     VARCHAR,
        "paid_at"            TIMESTAMPTZ,
        "collected_by"       UUID              REFERENCES "users"("id"),
        "remarks"            TEXT,
        "academic_year"      VARCHAR           NOT NULL,
        "term"               VARCHAR,
        "is_deleted"         BOOLEAN           NOT NULL DEFAULT false,
        "deleted_at"         TIMESTAMPTZ,
        "created_by"         UUID,
        "updated_by"         UUID,
        "created_at"         TIMESTAMPTZ       NOT NULL DEFAULT now(),
        "updated_at"         TIMESTAMPTZ       NOT NULL DEFAULT now()
      )
    `);
    await runner.query(`CREATE INDEX "idx_fee_payments_student" ON "fee_payments"("student_id")`);
    await runner.query(`CREATE INDEX "idx_fee_payments_branch"  ON "fee_payments"("branch_id")`);
    await runner.query(`CREATE INDEX "idx_fee_payments_status"  ON "fee_payments"("status")`);
  }
  async down(runner: QueryRunner) {
    await runner.query(`DROP TABLE "fee_payments"`);
    await runner.query(`DROP TABLE "fee_structures"`);
    await runner.query(`DROP TYPE "fee_status_enum"`);
    await runner.query(`DROP TYPE "payment_mode_enum"`);
  }
}
