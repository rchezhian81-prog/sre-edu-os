import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Student } from './student.entity';
import { CreateStudentDto } from './dto/create-student.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { paginate } from '../../common/utils/pagination.util';

@Injectable()
export class StudentsService {
  constructor(@InjectRepository(Student) private repo: Repository<Student>) {}

  async create(dto: CreateStudentDto, uid?: string) {
    const exists = await this.repo.findOne({ where: { admission_no: dto.admission_no, branch_id: dto.branch_id } });
    if (exists) throw new ConflictException('Admission number already exists in this branch');
    return this.repo.save(this.repo.create({ ...dto, created_by: uid }));
  }

  findAll(dto: PaginationDto, branchId?: string) {
    const q = this.repo.createQueryBuilder('s').where('s.is_deleted = false');
    if (branchId) q.andWhere('s.branch_id = :branchId', { branchId });
    if (dto.search) q.andWhere('s.full_name ILIKE :s OR s.admission_no ILIKE :s OR s.roll_no ILIKE :s', { s: `%${dto.search}%` });
    q.orderBy('s.full_name', 'ASC');
    return paginate(q, dto);
  }

  async findById(id: string) {
    const s = await this.repo.findOne({ where: { id, is_deleted: false } });
    if (!s) throw new NotFoundException(`Student ${id} not found`);
    return s;
  }

  async findByClass(classId: string, sectionId?: string) {
    const where: any = { class_id: classId, is_deleted: false };
    if (sectionId) where.section_id = sectionId;
    return this.repo.find({ where, order: { roll_no: 'ASC' } });
  }

  async update(id: string, dto: Partial<CreateStudentDto>, uid?: string) {
    const s = await this.findById(id);
    return this.repo.save(Object.assign(s, dto, { updated_by: uid }));
  }

  async remove(id: string, uid?: string) {
    const s = await this.findById(id);
    s.is_deleted = true; s.deleted_at = new Date(); s.updated_by = uid;
    await this.repo.save(s);
    return { message: 'Student deleted' };
  }

  async getStats(branchId: string) {
    const total = await this.repo.count({ where: { branch_id: branchId, is_deleted: false } });
    const active = await this.repo.count({ where: { branch_id: branchId, is_deleted: false, status: 'active' as any } });
    return { total, active, inactive: total - active };
  }
}
