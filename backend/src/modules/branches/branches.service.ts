import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Branch } from './branch.entity';
import { CreateBranchDto } from './dto/create-branch.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { paginate } from '../../common/utils/pagination.util';

@Injectable()
export class BranchesService {
  constructor(@InjectRepository(Branch) private repo: Repository<Branch>) {}

  create(dto: CreateBranchDto, uid?: string) { return this.repo.save(this.repo.create({ ...dto, created_by: uid })); }

  findAll(dto: PaginationDto) {
    const q = this.repo.createQueryBuilder('b').where('b.is_deleted = false');
    if (dto.search) q.andWhere('b.name ILIKE :s OR b.city ILIKE :s', { s: `%${dto.search}%` });
    q.orderBy('b.name', 'ASC');
    return paginate(q, dto);
  }

  async findById(id: string) {
    const b = await this.repo.findOne({ where: { id, is_deleted: false } });
    if (!b) throw new NotFoundException(`Branch ${id} not found`);
    return b;
  }

  async update(id: string, dto: Partial<CreateBranchDto>, uid?: string) {
    const b = await this.findById(id);
    return this.repo.save(Object.assign(b, dto, { updated_by: uid }));
  }

  async remove(id: string, uid?: string) {
    const b = await this.findById(id);
    b.is_deleted = true; b.deleted_at = new Date(); b.updated_by = uid;
    await this.repo.save(b);
    return { message: 'Branch deleted' };
  }
}
