import { Entity, Column } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
@Entity('fee_structures')
export class FeeStructure extends BaseEntity {
  @Column({ type: 'uuid' }) branch_id: string;
  @Column({ type: 'uuid', nullable: true }) class_id: string;
  @Column() name: string;
  @Column() academic_year: string;
  @Column({ type: 'decimal', precision: 10, scale: 2 }) amount: number;
  @Column({ nullable: true }) frequency: string; // term1, term2, annual, monthly
  @Column({ nullable: true }) due_date: string;
  @Column({ type: 'jsonb', nullable: true }) components: any[];
}
