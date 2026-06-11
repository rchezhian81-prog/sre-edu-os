import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SchoolEvent } from './events.entity';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { paginate } from '../../common/utils/pagination.util';

@Injectable()
export class EventsService {
  constructor(@InjectRepository(SchoolEvent) private repo: Repository<SchoolEvent>) {}

  create(data: Partial<SchoolEvent>, uid?: string) {
    return this.repo.save(this.repo.create({ ...data, created_by: uid }));
  }

  findAll(dto: PaginationDto, branchId?: string) {
    const q = this.repo.createQueryBuilder('e').where('e.is_deleted = false');
    if (branchId) q.andWhere('e.branch_id = :branchId', { branchId });
    if (dto.search) q.andWhere('e.title ILIKE :s OR e.venue ILIKE :s OR e.type ILIKE :s', { s: `%${dto.search}%` });
    if ((dto as any).type) q.andWhere('e.type = :type', { type: (dto as any).type });
    if ((dto as any).fromDate) q.andWhere('e.event_date >= :from', { from: (dto as any).fromDate });
    if ((dto as any).toDate) q.andWhere('e.event_date <= :to', { to: (dto as any).toDate });
    q.orderBy('e.event_date', 'ASC');
    return paginate(q, dto);
  }

  async findUpcoming(branchId: string, limit = 10) {
    return this.repo
      .createQueryBuilder('e')
      .where('e.branch_id = :branchId AND e.is_deleted = false AND e.event_date >= CURRENT_DATE', { branchId })
      .orderBy('e.event_date', 'ASC')
      .limit(limit)
      .getMany();
  }

  async findHolidays(branchId: string) {
    return this.repo.find({ where: { branch_id: branchId, is_holiday: true, is_deleted: false } });
  }

  async findById(id: string) {
    const e = await this.repo.findOne({ where: { id, is_deleted: false } });
    if (!e) throw new NotFoundException(`Event ${id} not found`);
    return e;
  }

  async update(id: string, data: Partial<SchoolEvent>, uid?: string) {
    const e = await this.findById(id);
    return this.repo.save(Object.assign(e, data, { updated_by: uid }));
  }

  async remove(id: string, uid?: string) {
    const e = await this.findById(id);
    e.is_deleted = true; e.deleted_at = new Date(); e.updated_by = uid;
    await this.repo.save(e);
    return { message: 'Event removed' };
  }
}
