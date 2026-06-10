import { Entity, Column } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
@Entity('reports')
export class SavedReport extends BaseEntity {
  @Column({ type: 'uuid' }) branch_id: string;
  @Column({ type: 'uuid' }) generated_by: string;
  @Column() report_type: string;
  @Column() title: string;
  @Column({ nullable: true }) file_url: string;
  @Column({ type: 'jsonb', nullable: true }) filters: any;
  @Column({ nullable: true }) generated_at: Date;
}
