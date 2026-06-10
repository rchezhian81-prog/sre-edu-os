import { Entity, Column } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
@Entity('hr')
export class LeaveRequest extends BaseEntity {
  @Column({ type: 'uuid' }) branch_id: string;
  @Column({ type: 'uuid' }) staff_id: string;
  @Column() leave_type: string;
  @Column({ type: 'date' }) from_date: string;
  @Column({ type: 'date' }) to_date: string;
  @Column({ nullable: true, type: 'text' }) reason: string;
  @Column({ default: 'pending' }) status: string;
  @Column({ type: 'uuid', nullable: true }) approved_by: string;
  @Column({ nullable: true }) approved_at: Date;
}
