import { Entity, Column } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import { Status, Gender } from '../../common/enums/status.enum';
@Entity('staff')
export class Staff extends BaseEntity {
  @Column({ type: 'uuid' }) branch_id: string;
  @Column({ type: 'uuid', nullable: true }) user_id: string;
  @Column() employee_id: string;
  @Column() full_name: string;
  @Column({ nullable: true }) designation: string;
  @Column({ nullable: true }) department: string;
  @Column({ type: 'enum', enum: Gender, nullable: true }) gender: Gender;
  @Column({ nullable: true }) phone: string;
  @Column({ nullable: true }) email: string;
  @Column({ nullable: true }) qualification: string;
  @Column({ type: 'date', nullable: true }) join_date: string;
  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true }) salary: number;
  @Column({ nullable: true }) photo_url: string;
  @Column({ type: 'jsonb', nullable: true }) subjects_assigned: string[];
  @Column({ type: 'enum', enum: Status, default: Status.ACTIVE }) status: Status;
}
