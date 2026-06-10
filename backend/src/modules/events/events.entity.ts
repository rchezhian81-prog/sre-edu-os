import { Entity, Column } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
@Entity('events')
export class SchoolEvent extends BaseEntity {
  @Column({ type: 'uuid' }) branch_id: string;
  @Column() title: string;
  @Column({ type: 'text', nullable: true }) description: string;
  @Column({ type: 'date' }) event_date: string;
  @Column({ nullable: true }) start_time: string;
  @Column({ nullable: true }) end_time: string;
  @Column({ nullable: true }) venue: string;
  @Column({ nullable: true }) type: string; // sports, cultural, academic, holiday
  @Column({ default: false }) is_holiday: boolean;
}
