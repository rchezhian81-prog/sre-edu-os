import { Entity, Column } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
@Entity('timetable')
export class Timetable extends BaseEntity {
  @Column({ type: 'uuid' }) branch_id: string;
  @Column({ type: 'uuid' }) class_id: string;
  @Column({ type: 'uuid' }) section_id: string;
  @Column({ type: 'uuid' }) subject_id: string;
  @Column({ type: 'uuid' }) teacher_id: string;
  @Column() day_of_week: string;
  @Column() period_no: number;
  @Column() start_time: string;
  @Column() end_time: string;
  @Column({ nullable: true }) room_no: string;
  @Column({ nullable: true }) academic_year: string;
}
