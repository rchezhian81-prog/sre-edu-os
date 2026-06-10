import { Entity, Column, Index, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import { Status, Gender } from '../../common/enums/status.enum';

@Entity('students')
export class Student extends BaseEntity {
  @Column() @Index() admission_no: string;
  @Column() full_name: string;
  @Column({ nullable: true }) roll_no: string;
  @Column({ type: 'enum', enum: Gender, nullable: true }) gender: Gender;
  @Column({ type: 'date', nullable: true }) date_of_birth: Date;
  @Column({ type: 'uuid' }) branch_id: string;
  @Column({ type: 'uuid', nullable: true }) class_id: string;
  @Column({ type: 'uuid', nullable: true }) section_id: string;
  @Column({ nullable: true }) parent_name: string;
  @Column({ nullable: true }) parent_phone: string;
  @Column({ nullable: true }) parent_email: string;
  @Column({ nullable: true }) address: string;
  @Column({ nullable: true }) blood_group: string;
  @Column({ nullable: true }) photo_url: string;
  @Column({ type: 'date', nullable: true }) admission_date: Date;
  @Column({ type: 'enum', enum: Status, default: Status.ACTIVE }) status: Status;
  @Column({ type: 'jsonb', nullable: true }) extra_info: Record<string, any>;
}
