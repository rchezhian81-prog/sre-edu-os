import { Entity, Column } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
@Entity('subjects')
export class Subject extends BaseEntity {
  @Column({ type: 'uuid' }) branch_id: string;
  @Column() name: string;
  @Column({ nullable: true }) code: string;
  @Column({ nullable: true }) type: string; // theory, practical, both
  @Column({ nullable: true }) max_marks_theory: number;
  @Column({ nullable: true }) max_marks_practical: number;
  @Column({ nullable: true }) pass_marks: number;
}
