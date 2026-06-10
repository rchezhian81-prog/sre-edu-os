export interface FeePayment {
  id: string; studentId: string; receiptNo: string;
  amountDue: number; amountPaid: number; discount: number; lateFee: number;
  status: 'pending'|'paid'|'partial'|'overdue'|'waived';
  paymentMode?: 'cash'|'upi'|'card'|'netbanking'|'cheque'|'demand_draft';
  transactionId?: string; paidAt?: string; academicYear: string; term?: string;
}
export interface FeeStructure {
  id: string; branchId: string; classId?: string; name: string;
  academicYear: string; amount: number; frequency: string; dueDate?: string;
}
