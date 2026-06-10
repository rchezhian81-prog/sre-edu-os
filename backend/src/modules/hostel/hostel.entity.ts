import { Entity, Column } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
@Entity('hostel')
export class HostelRoom extends BaseEntity {
  @Column({ type: 'uuid' }) branch_id: string;
  @Column() room_no: string;
  @Column({ nullable: true }) block: string;
  @Column({ nullable: true }) floor: number;
  @Column({ default: 4 }) capacity: number;
  @Column({ default: 0 }) occupied: number;
  @Column({ nullable: true }) type: string; // boys, girls
  @Column({ nullable: true }) fee_per_month: number;
}
