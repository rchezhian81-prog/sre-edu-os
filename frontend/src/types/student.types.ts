export interface Student {
  id: string; admissionNo: string; fullName: string; rollNo?: string;
  gender?: 'male'|'female'|'other'; dateOfBirth?: string;
  branchId: string; classId?: string; sectionId?: string;
  parentName?: string; parentPhone?: string; parentEmail?: string;
  address?: string; bloodGroup?: string; photoUrl?: string; admissionDate?: string;
  status: 'active'|'inactive'|'archived'; createdAt: string;
}
export interface StudentStats { total: number; active: number; inactive: number; }
