import { Entity, Column } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
@Entity('sections')
export class Section extends BaseEntity {
  @Column({ type: 'uuid' }) branch_id: string;
  @Column({ type: 'uuid' }) class_id: string;
  @Column() name: string;
  @Column({ nullable: true, type: 'uuid' }) class_teacher_id: string;
  @Column({ nullable: true }) capacity: number;
}
