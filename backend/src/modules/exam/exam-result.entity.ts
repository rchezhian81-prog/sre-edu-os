import { Entity, Column, Index, Unique } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
@Entity('exam_results') @Unique(['student_id','exam_schedule_id','subject_id'])
export class ExamResult extends BaseEntity {
  @Column({ type: 'uuid' }) @Index() student_id: string;
  @Column({ type: 'uuid' }) branch_id: string;
  @Column({ type: 'uuid' }) exam_schedule_id: string;
  @Column({ type: 'uuid' }) subject_id: string;
  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true }) marks_theory: number;
  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true }) marks_practical: number;
  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true }) total_marks: number;
  @Column({ nullable: true }) grade: string;
  @Column({ default: false }) is_absent: boolean;
  @Column({ nullable: true }) remarks: string;
  @Column({ nullable: true }) entered_by: string;
}
