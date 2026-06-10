export type AttendanceStatus = 'present'|'absent'|'late'|'half_day'|'leave';
export interface AttendanceRecord {
  id: string; studentId: string; date: string; status: AttendanceStatus; remarks?: string;
}
export interface AttendanceSummary { total: number; present: number; absent: number; late: number; leave: number; }
export interface MonthlyAttendance { records: AttendanceRecord[]; summary: AttendanceSummary; percentage: number; }
