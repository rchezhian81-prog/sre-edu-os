import { IsString, IsNotEmpty, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class NlQueryDto {
  @ApiProperty({ example: 'Which class has the worst attendance this month?' })
  @IsString() @IsNotEmpty() @MaxLength(500)
  query!: string;
}

export interface AtRiskStudent {
  id:         string;
  name:       string;
  percentage: number;
}

export interface AttendanceInsightDto {
  avgAttendance:  number;
  atRiskCount:    number;
  chronicCount:   number;
  highAbsentDay:  string;
  atRiskStudents: AtRiskStudent[];
  narrative:      string;
}

export interface FeeRiskDto {
  studentId:      string;
  name:           string;
  outstanding:    number;
  unpaidTerms:    number;
  daysSincePay:   number;
  riskScore:      number;
  riskLevel:      'HIGH' | 'MEDIUM' | 'LOW';
  recommendation: string;
}

export interface SubjectBreakdown {
  subject:   string;
  class:     string;
  avgScore:  number;
  failCount: number;
  total:     number;
}

export interface PerformanceInsightDto {
  subjectBreakdown:    SubjectBreakdown[];
  weakSubjects:        string[];
  topFailRateSubjects: { subject: string; class: string; failPct: number }[];
  narrative:           string;
}

export interface AnomalyDto {
  type:     string;
  severity: 'HIGH' | 'MEDIUM' | 'LOW';
  title:    string;
  detail:   string;
  action:   string;
}
