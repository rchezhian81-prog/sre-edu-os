import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FeeStructure } from './fee-structure.entity';
import { FeePayment } from './fee-payment.entity';
import { FeeStatus, PaymentMode } from '../../common/enums/status.enum';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class FeesService {
  constructor(
    @InjectRepository(FeeStructure) private structRepo: Repository<FeeStructure>,
    @InjectRepository(FeePayment) private payRepo: Repository<FeePayment>,
  ) {}

  // Fee structures
  createStructure(dto: any, uid?: string) { return this.structRepo.save(this.structRepo.create({ ...dto, created_by: uid })); }
  getStructures(branchId: string) { return this.structRepo.find({ where: { branch_id: branchId, is_deleted: false } }); }

  // Payments
  async collectPayment(dto: any, branchId: string, uid: string) {
    const receiptNo = `RCP-${Date.now().toString().slice(-8)}`;
    const amountDue = dto.amount_due ?? 0;
    const amountPaid = dto.amount_paid ?? 0;
    const status: FeeStatus = amountPaid >= amountDue ? FeeStatus.PAID : amountPaid > 0 ? FeeStatus.PARTIAL : FeeStatus.PENDING;
    const payment = this.payRepo.create({
      ...dto, branch_id: branchId, receipt_no: receiptNo,
      status, paid_at: new Date(), collected_by: uid, created_by: uid,
    });
    return this.payRepo.save(payment);
  }

  getStudentFees(studentId: string) {
    return this.payRepo.find({ where: { student_id: studentId, is_deleted: false }, order: { created_at: 'DESC' } });
  }

  async getDefaulters(branchId: string, academicYear: string) {
    return this.payRepo.find({ where: { branch_id: branchId, academic_year: academicYear, status: FeeStatus.PENDING, is_deleted: false } });
  }

  async getCollectionSummary(branchId: string, academicYear: string) {
    const rows = await this.payRepo.query(`
      SELECT term, SUM(amount_due) AS due, SUM(amount_paid) AS collected,
             COUNT(*) AS total_students, COUNT(*) FILTER (WHERE status='paid') AS paid_count
      FROM fee_payments
      WHERE branch_id=$1 AND academic_year=$2 AND is_deleted=false
      GROUP BY term ORDER BY term
    `, [branchId, academicYear]);
    return rows;
  }
}
