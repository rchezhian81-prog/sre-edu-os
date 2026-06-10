import { Entity, Column } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import { ExamType } from '../../common/enums/status.enum';
@Entity('exam_schedules')
export class ExamSchedule extends BaseEntity {
  @Column({ type: 'uuid' }) branch_id: string;
  @Column({ type: 'uuid', nullable: true }) class_id: string;
  @Column({ type: 'enum', enum: ExamType }) exam_type: ExamType;
  @Column() name: string;
  @Column() academic_year: string;
  @Column({ nullable: true }) term: string;
  @Column({ type: 'date', nullable: true }) start_date: string;
  @Column({ type: 'date', nullable: true }) end_date: string;
  @Column({ type: 'jsonb', nullable: true }) subject_schedule: any[];
}
