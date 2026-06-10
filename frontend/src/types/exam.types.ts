export interface ExamSchedule {
  id: string; branchId: string; classId?: string; examType: string; name: string;
  academicYear: string; term?: string; startDate?: string; endDate?: string;
}
export interface ExamResult {
  id: string; studentId: string; examScheduleId: string; subjectId: string;
  marksTheory?: number; marksPractical?: number; totalMarks?: number; grade?: string;
  isAbsent: boolean; remarks?: string;
}
export interface ReportCard {
  results: ExamResult[];
  summary: { totalObtained: number; totalMax: number; percentage: string; grade: string; };
}
