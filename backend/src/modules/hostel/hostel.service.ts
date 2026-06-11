import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HostelRoom } from './hostel.entity';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { paginate } from '../../common/utils/pagination.util';

@Injectable()
export class HostelService {
  constructor(@InjectRepository(HostelRoom) private repo: Repository<HostelRoom>) {}

  create(data: Partial<HostelRoom>, uid?: string) {
    return this.repo.save(this.repo.create({ ...data, created_by: uid }));
  }

  findAll(dto: PaginationDto, branchId?: string) {
    const q = this.repo.createQueryBuilder('r').where('r.is_deleted = false');
    if (branchId) q.andWhere('r.branch_id = :branchId', { branchId });
    if (dto.search) q.andWhere('r.room_no ILIKE :s OR r.block ILIKE :s', { s: `%${dto.search}%` });
    if ((dto as any).type) q.andWhere('r.type = :type', { type: (dto as any).type });
    q.orderBy('r.block', 'ASC').addOrderBy('r.room_no', 'ASC');
    return paginate(q, dto);
  }

  async findById(id: string) {
    const r = await this.repo.findOne({ where: { id, is_deleted: false } });
    if (!r) throw new NotFoundException(`Room ${id} not found`);
    return r;
  }

  async update(id: string, data: Partial<HostelRoom>, uid?: string) {
    const r = await this.findById(id);
    return this.repo.save(Object.assign(r, data, { updated_by: uid }));
  }

  async allocate(id: string, uid?: string) {
    const r = await this.findById(id);
    if (r.occupied >= r.capacity) throw new BadRequestException('Room is full');
    r.occupied += 1;
    r.updated_by = uid;
    return this.repo.save(r);
  }

  async vacate(id: string, uid?: string) {
    const r = await this.findById(id);
    if (r.occupied <= 0) throw new BadRequestException('Room is already empty');
    r.occupied -= 1;
    r.updated_by = uid;
    return this.repo.save(r);
  }

  async remove(id: string, uid?: string) {
    const r = await this.findById(id);
    r.is_deleted = true; r.deleted_at = new Date(); r.updated_by = uid;
    await this.repo.save(r);
    return { message: 'Room removed' };
  }

  async getStats(branchId: string) {
    const total = await this.repo.count({ where: { branch_id: branchId, is_deleted: false } });
    const result = await this.repo
      .createQueryBuilder('r')
      .select('SUM(r.capacity)', 'totalCapacity')
      .addSelect('SUM(r.occupied)', 'totalOccupied')
      .where('r.branch_id = :branchId AND r.is_deleted = false', { branchId })
      .getRawOne();
    return {
      totalRooms: total,
      totalCapacity: +result.totalCapacity || 0,
      totalOccupied: +result.totalOccupied || 0,
      totalVacant: (+result.totalCapacity || 0) - (+result.totalOccupied || 0),
    };
  }
}
