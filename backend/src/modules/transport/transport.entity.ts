import { Entity, Column } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
@Entity('transport')
export class TransportRoute extends BaseEntity {
  @Column({ type: 'uuid' }) branch_id: string;
  @Column() route_name: string;
  @Column({ nullable: true }) route_code: string;
  @Column({ nullable: true }) driver_name: string;
  @Column({ nullable: true }) driver_phone: string;
  @Column({ nullable: true }) vehicle_no: string;
  @Column({ nullable: true }) vehicle_type: string;
  @Column({ nullable: true }) capacity: number;
  @Column({ type: 'jsonb', nullable: true }) stops: any[];
}
