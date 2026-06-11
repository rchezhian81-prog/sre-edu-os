import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Staff } from './staff.entity';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { paginate } from '../../common/utils/pagination.util';

@Injectable()
export class StaffService {
  constructor(@InjectRepository(Staff) private repo: Repository<Staff>) {}

  async create(data: Partial<Staff>, uid?: string) {
    const exists = await this.repo.findOne({ where: { employee_id: data.employee_id, branch_id: data.branch_id } });
    if (exists) throw new ConflictException('Employee ID already exists in this branch');
    return this.repo.save(this.repo.create({ ...data, created_by: uid }));
  }

  findAll(dto: PaginationDto, branchId?: string) {
    const q = this.repo.createQueryBuilder('s').where('s.is_deleted = false');
    if (branchId) q.andWhere('s.branch_id = :branchId', { branchId });
    if (dto.search) q.andWhere('s.full_name ILIKE :s OR s.employee_id ILIKE :s OR s.designation ILIKE :s OR s.department ILIKE :s', { s: `%${dto.search}%` });
    if ((dto as any).department) q.andWhere('s.department = :dept', { dept: (dto as any).department });
    q.orderBy('s.full_name', 'ASC');
    return paginate(q, dto);
  }

  async findById(id: string) {
    const s = await this.repo.findOne({ where: { id, is_deleted: false } });
    if (!s) throw new NotFoundException(`Staff ${id} not found`);
    return s;
  }

  async update(id: string, data: Partial<Staff>, uid?: string) {
    const s = await this.findById(id);
    return this.repo.save(Object.assign(s, data, { updated_by: uid }));
  }

  async remove(id: string, uid?: string) {
    const s = await this.findById(id);
    s.is_deleted = true; s.deleted_at = new Date(); s.updated_by = uid;
    await this.repo.save(s);
    return { message: 'Staff removed' };
  }

  async getStats(branchId: string) {
    const total = await this.repo.count({ where: { branch_id: branchId, is_deleted: false } });
    const active = await this.repo.count({ where: { branch_id: branchId, is_deleted: false, status: 'active' as any } });
    const deptResult = await this.repo
      .createQueryBuilder('s')
      .select('s.department', 'department')
      .addSelect('COUNT(*)', 'count')
      .where('s.branch_id = :branchId AND s.is_deleted = false', { branchId })
      .groupBy('s.department')
      .getRawMany();
    return { total, active, inactive: total - active, byDepartment: deptResult };
  }
}
