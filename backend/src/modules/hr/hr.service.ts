import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LeaveRequest } from './hr.entity';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { paginate } from '../../common/utils/pagination.util';

@Injectable()
export class HrService {
  constructor(@InjectRepository(LeaveRequest) private repo: Repository<LeaveRequest>) {}

  create(data: Partial<LeaveRequest>, uid?: string) {
    return this.repo.save(this.repo.create({ ...data, status: 'pending', created_by: uid }));
  }

  findAll(dto: PaginationDto, branchId?: string) {
    const q = this.repo.createQueryBuilder('l').where('l.is_deleted = false');
    if (branchId) q.andWhere('l.branch_id = :branchId', { branchId });
    if ((dto as any).staffId) q.andWhere('l.staff_id = :sid', { sid: (dto as any).staffId });
    if ((dto as any).status) q.andWhere('l.status = :status', { status: (dto as any).status });
    q.orderBy('l.created_at', 'DESC');
    return paginate(q, dto);
  }

  async findById(id: string) {
    const l = await this.repo.findOne({ where: { id, is_deleted: false } });
    if (!l) throw new NotFoundException(`Leave request ${id} not found`);
    return l;
  }

  async approve(id: string, uid: string) {
    const l = await this.findById(id);
    if (l.status !== 'pending') throw new BadRequestException('Can only approve pending requests');
    l.status = 'approved'; l.approved_by = uid; l.approved_at = new Date(); l.updated_by = uid;
    return this.repo.save(l);
  }

  async reject(id: string, uid: string) {
    const l = await this.findById(id);
    if (l.status !== 'pending') throw new BadRequestException('Can only reject pending requests');
    l.status = 'rejected'; l.approved_by = uid; l.approved_at = new Date(); l.updated_by = uid;
    return this.repo.save(l);
  }

  async cancel(id: string, uid: string) {
    const l = await this.findById(id);
    if (!['pending', 'approved'].includes(l.status)) throw new BadRequestException('Cannot cancel this request');
    l.status = 'cancelled'; l.updated_by = uid;
    return this.repo.save(l);
  }

  async getStats(branchId: string) {
    const statuses = ['pending', 'approved', 'rejected', 'cancelled'];
    const result: any = {};
    for (const s of statuses) {
      result[s] = await this.repo.count({ where: { branch_id: branchId, status: s, is_deleted: false } });
    }
    return result;
  }
}
