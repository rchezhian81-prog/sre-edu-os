import { Entity, Column, Index, Unique } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import { AttendanceStatus } from '../../common/enums/status.enum';

@Entity('attendance') @Unique(['student_id','date','period_no'])
export class Attendance extends BaseEntity {
  @Column({ type: 'uuid' }) @Index() student_id: string;
  @Column({ type: 'uuid' }) branch_id: string;
  @Column({ type: 'uuid', nullable: true }) class_id: string;
  @Column({ type: 'uuid', nullable: true }) section_id: string;
  @Column({ type: 'uuid', nullable: true }) marked_by: string;
  @Column({ type: 'date' }) @Index() date: string;
  @Column({ nullable: true, default: 0 }) period_no: number;
  @Column({ type: 'enum', enum: AttendanceStatus, default: AttendanceStatus.PRESENT }) status: AttendanceStatus;
  @Column({ nullable: true }) remarks: string;
}
