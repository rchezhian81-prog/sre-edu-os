import { MigrationInterface, QueryRunner } from 'typeorm';
export class CreateRemainingTables1700000009 implements MigrationInterface {
  name = 'CreateRemainingTables1700000009';
  async up(runner: QueryRunner) {
    // Timetable
    await runner.query(`
      CREATE TABLE "timetable" (
        "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        "branch_id" UUID NOT NULL, "class_id" UUID NOT NULL, "section_id" UUID NOT NULL,
        "subject_id" UUID NOT NULL, "teacher_id" UUID NOT NULL,
        "day_of_week" VARCHAR NOT NULL, "period_no" INTEGER NOT NULL,
        "start_time" VARCHAR NOT NULL, "end_time" VARCHAR NOT NULL,
        "room_no" VARCHAR, "academic_year" VARCHAR,
        "is_deleted" BOOLEAN NOT NULL DEFAULT false,
        "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(), "updated_at" TIMESTAMPTZ NOT NULL DEFAULT now()
      )
    `);
    // Library
    await runner.query(`
      CREATE TABLE "library" (
        "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        "branch_id" UUID NOT NULL, "title" VARCHAR NOT NULL, "author" VARCHAR,
        "isbn" VARCHAR, "category" VARCHAR, "publisher" VARCHAR,
        "total_copies" INTEGER DEFAULT 1, "available_copies" INTEGER DEFAULT 1, "rack_no" VARCHAR,
        "is_deleted" BOOLEAN NOT NULL DEFAULT false,
        "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(), "updated_at" TIMESTAMPTZ NOT NULL DEFAULT now()
      )
    `);
    // Transport
    await runner.query(`
      CREATE TABLE "transport" (
        "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        "branch_id" UUID NOT NULL, "route_name" VARCHAR NOT NULL, "route_code" VARCHAR,
        "driver_name" VARCHAR, "driver_phone" VARCHAR, "vehicle_no" VARCHAR,
        "vehicle_type" VARCHAR, "capacity" INTEGER, "stops" JSONB,
        "is_deleted" BOOLEAN NOT NULL DEFAULT false,
        "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(), "updated_at" TIMESTAMPTZ NOT NULL DEFAULT now()
      )
    `);
    // Notifications
    await runner.query(`
      CREATE TABLE "notifications" (
        "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        "branch_id" UUID NOT NULL, "recipient_id" UUID, "type" VARCHAR NOT NULL,
        "title" VARCHAR NOT NULL, "message" TEXT NOT NULL,
        "is_read" BOOLEAN NOT NULL DEFAULT false, "sent_at" TIMESTAMPTZ, "read_at" TIMESTAMPTZ,
        "metadata" JSONB,
        "is_deleted" BOOLEAN NOT NULL DEFAULT false,
        "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(), "updated_at" TIMESTAMPTZ NOT NULL DEFAULT now()
      )
    `);
    // Events
    await runner.query(`
      CREATE TABLE "events" (
        "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        "branch_id" UUID NOT NULL, "title" VARCHAR NOT NULL, "description" TEXT,
        "event_date" DATE NOT NULL, "start_time" VARCHAR, "end_time" VARCHAR,
        "venue" VARCHAR, "type" VARCHAR, "is_holiday" BOOLEAN DEFAULT false,
        "is_deleted" BOOLEAN NOT NULL DEFAULT false,
        "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(), "updated_at" TIMESTAMPTZ NOT NULL DEFAULT now()
      )
    `);
    // Hostel
    await runner.query(`
      CREATE TABLE "hostel" (
        "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        "branch_id" UUID NOT NULL, "room_no" VARCHAR NOT NULL, "block" VARCHAR,
        "floor" INTEGER, "capacity" INTEGER DEFAULT 4, "occupied" INTEGER DEFAULT 0,
        "type" VARCHAR, "fee_per_month" NUMERIC(10,2),
        "is_deleted" BOOLEAN NOT NULL DEFAULT false,
        "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(), "updated_at" TIMESTAMPTZ NOT NULL DEFAULT now()
      )
    `);
    // HR Leave
    await runner.query(`
      CREATE TABLE "hr" (
        "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        "branch_id" UUID NOT NULL, "staff_id" UUID NOT NULL REFERENCES "staff"("id"),
        "leave_type" VARCHAR NOT NULL, "from_date" DATE NOT NULL, "to_date" DATE NOT NULL,
        "reason" TEXT, "status" VARCHAR NOT NULL DEFAULT 'pending',
        "approved_by" UUID REFERENCES "users"("id"), "approved_at" TIMESTAMPTZ,
        "is_deleted" BOOLEAN NOT NULL DEFAULT false,
        "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(), "updated_at" TIMESTAMPTZ NOT NULL DEFAULT now()
      )
    `);
    // Inventory
    await runner.query(`
      CREATE TABLE "inventory" (
        "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        "branch_id" UUID NOT NULL, "item_name" VARCHAR NOT NULL, "category" VARCHAR,
        "unit" VARCHAR, "quantity" INTEGER DEFAULT 0, "unit_price" NUMERIC(10,2),
        "supplier" VARCHAR, "location" VARCHAR,
        "is_deleted" BOOLEAN NOT NULL DEFAULT false,
        "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(), "updated_at" TIMESTAMPTZ NOT NULL DEFAULT now()
      )
    `);

    // Row Level Security for branch isolation
    await runner.query(`ALTER TABLE "students"     ENABLE ROW LEVEL SECURITY`);
    await runner.query(`ALTER TABLE "attendance"   ENABLE ROW LEVEL SECURITY`);
    await runner.query(`ALTER TABLE "fee_payments" ENABLE ROW LEVEL SECURITY`);
    await runner.query(`ALTER TABLE "exam_results" ENABLE ROW LEVEL SECURITY`);
  }
  async down(runner: QueryRunner) {
    await runner.query(`DROP TABLE IF EXISTS "inventory","hr","hostel","events","notifications","transport","library","timetable"`);
  }
}
