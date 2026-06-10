import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Attendance } from './attendance.entity';
import { MarkAttendanceDto } from './dto/mark-attendance.dto';

@Injectable()
export class AttendanceService {
  constructor(@InjectRepository(Attendance) private repo: Repository<Attendance>) {}

  async markBulk(dto: MarkAttendanceDto, branchId: string, markedBy: string) {
    const records = dto.entries.map(e => this.repo.create({
      student_id: e.student_id, branch_id: branchId,
      class_id: dto.class_id, section_id: dto.section_id,
      date: dto.date, period_no: dto.period_no ?? 0,
      status: e.status, remarks: e.remarks,
      marked_by: markedBy, created_by: markedBy,
    }));
    // Upsert: delete existing for this class+date+period, re-insert
    await this.repo.delete({ class_id: dto.class_id, date: dto.date, period_no: dto.period_no ?? 0 });
    return this.repo.save(records);
  }

  async getByClassDate(classId: string, date: string, sectionId?: string) {
    const where: any = { class_id: classId, date, is_deleted: false };
    if (sectionId) where.section_id = sectionId;
    return this.repo.find({ where });
  }

  async getStudentMonthly(studentId: string, year: number, month: number) {
    const start = `${year}-${String(month).padStart(2,'0')}-01`;
    const end   = `${year}-${String(month).padStart(2,'0')}-31`;
    const records = await this.repo.find({ where: { student_id: studentId, is_deleted: false, date: Between(start, end) as any }, order: { date: 'ASC' } });
    const summary = { total: records.length, present: 0, absent: 0, late: 0, leave: 0 };
    records.forEach(r => { if (r.status in summary) summary[r.status]++; });
    return { records, summary, percentage: records.length ? Math.round((summary.present / records.length) * 100) : 0 };
  }

  async getAtRiskStudents(branchId: string, threshold = 75) {
    // Students with attendance below threshold this month
    const now = new Date();
    const start = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-01`;
    const end = now.toISOString().split('T')[0];
    const raw = await this.repo.query(`
      SELECT student_id,
             COUNT(*) FILTER (WHERE status = 'present') AS present,
             COUNT(*) AS total,
             ROUND(COUNT(*) FILTER (WHERE status = 'present') * 100.0 / NULLIF(COUNT(*),0)) AS pct
      FROM attendance
      WHERE branch_id = $1 AND date BETWEEN $2 AND $3 AND is_deleted = false
      GROUP BY student_id
      HAVING ROUND(COUNT(*) FILTER (WHERE status = 'present') * 100.0 / NULLIF(COUNT(*),0)) < $4
      ORDER BY pct ASC LIMIT 50
    `, [branchId, start, end, threshold]);
    return raw;
  }
}
