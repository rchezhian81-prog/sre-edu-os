import { Entity, Column, Index } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import { Status } from '../../common/enums/status.enum';

@Entity('branches')
export class Branch extends BaseEntity {
  @Column() @Index({ unique: true }) name: string;
  @Column({ nullable: true }) code: string;
  @Column({ nullable: true }) address: string;
  @Column({ nullable: true }) city: string;
  @Column({ nullable: true }) state: string;
  @Column({ nullable: true }) pincode: string;
  @Column({ nullable: true }) phone: string;
  @Column({ nullable: true }) email: string;
  @Column({ nullable: true }) principal_name: string;
  @Column({ type: 'enum', enum: Status, default: Status.ACTIVE }) status: Status;
  @Column({ type: 'jsonb', nullable: true }) settings: Record<string, any>;
}
