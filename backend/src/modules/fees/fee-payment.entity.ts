import { Entity, Column, Index } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import { FeeStatus, PaymentMode } from '../../common/enums/status.enum';
@Entity('fee_payments')
export class FeePayment extends BaseEntity {
  @Column({ type: 'uuid' }) @Index() student_id: string;
  @Column({ type: 'uuid' }) branch_id: string;
  @Column({ type: 'uuid', nullable: true }) fee_structure_id: string;
  @Column() receipt_no: string;
  @Column({ type: 'decimal', precision: 10, scale: 2 }) amount_due: number;
  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 }) amount_paid: number;
  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 }) discount: number;
  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 }) late_fee: number;
  @Column({ type: 'enum', enum: FeeStatus, default: FeeStatus.PENDING }) status: FeeStatus;
  @Column({ type: 'enum', enum: PaymentMode, nullable: true }) payment_mode: PaymentMode;
  @Column({ nullable: true }) transaction_id: string;
  @Column({ nullable: true }) paid_at: Date;
  @Column({ nullable: true }) collected_by: string;
  @Column({ nullable: true }) remarks: string;
  @Column() academic_year: string;
  @Column({ nullable: true }) term: string;
}
