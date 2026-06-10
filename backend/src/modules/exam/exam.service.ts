import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ExamSchedule } from './exam-schedule.entity';
import { ExamResult } from './exam-result.entity';

const GRADE_SCALE = [
  { min:90, grade:'A+', gp:10 }, { min:80, grade:'A', gp:9 }, { min:70, grade:'B+', gp:8 },
  { min:60, grade:'B', gp:7 }, { min:50, grade:'C', gp:6 }, { min:40, grade:'D', gp:5 },
  { min:0,  grade:'F', gp:0 },
];
function calcGrade(pct: number) { return GRADE_SCALE.find(g => pct >= g.min) || GRADE_SCALE[GRADE_SCALE.length-1]; }

@Injectable()
export class ExamService {
  constructor(
    @InjectRepository(ExamSchedule) private schedRepo: Repository<ExamSchedule>,
    @InjectRepository(ExamResult) private resRepo: Repository<ExamResult>,
  ) {}

  // Schedules
  getSchedules(branchId: string) { return this.schedRepo.find({ where: { branch_id: branchId, is_deleted: false }, order: { start_date: 'DESC' } }); }
  createSchedule(dto: any, uid?: string) { return this.schedRepo.save(this.schedRepo.create({ ...dto, created_by: uid })); }

  // Results
  async enterResults(examId: string, results: any[], enteredBy: string, branchId: string) {
    const records = results.map(r => {
      const total = (r.marks_theory || 0) + (r.marks_practical || 0);
      const maxTotal = (r.max_theory || 100) + (r.max_practical || 0);
      const pct = maxTotal ? (total / maxTotal) * 100 : 0;
      const { grade } = calcGrade(pct);
      return this.resRepo.create({ ...r, exam_schedule_id: examId, total_marks: total, grade, branch_id: branchId, entered_by: enteredBy, created_by: enteredBy });
    });
    // Upsert
    await this.resRepo.createQueryBuilder().delete().where('exam_schedule_id = :examId', { examId }).execute();
    return this.resRepo.save(records);
  }

  getStudentResults(studentId: string) {
    return this.resRepo.find({ where: { student_id: studentId, is_deleted: false }, order: { created_at: 'DESC' } });
  }

  async getClassResults(examId: string) {
    return this.resRepo.find({ where: { exam_schedule_id: examId, is_deleted: false } });
  }

  async getReportCard(studentId: string, examId: string) {
    const results = await this.resRepo.find({ where: { student_id: studentId, exam_schedule_id: examId, is_deleted: false } });
    const totalObtained = results.reduce((s, r) => s + (+r.total_marks || 0), 0);
    const totalMax = results.length * 100; // simplified
    const percentage = totalMax ? (totalObtained / totalMax * 100) : 0;
    const { grade } = calcGrade(percentage);
    return { results, summary: { totalObtained, totalMax, percentage: percentage.toFixed(1), grade } };
  }
}
