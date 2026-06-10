import { Entity, Column } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
@Entity('notifications')
export class Notification extends BaseEntity {
  @Column({ type: 'uuid' }) branch_id: string;
  @Column({ type: 'uuid', nullable: true }) recipient_id: string;
  @Column() type: string;
  @Column() title: string;
  @Column({ type: 'text' }) message: string;
  @Column({ default: false }) is_read: boolean;
  @Column({ nullable: true }) sent_at: Date;
  @Column({ nullable: true }) read_at: Date;
  @Column({ type: 'jsonb', nullable: true }) metadata: any;
}
