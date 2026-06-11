import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SavedReport } from './reports.entity';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { paginate } from '../../common/utils/pagination.util';

@Injectable()
export class ReportsService {
  constructor(@InjectRepository(SavedReport) private repo: Repository<SavedReport>) {}

  create(data: Partial<SavedReport>, uid: string) {
    return this.repo.save(this.repo.create({
      ...data,
      generated_by: uid,
      generated_at: new Date(),
      created_by: uid,
    }));
  }

  findAll(dto: PaginationDto, branchId?: string) {
    const q = this.repo.createQueryBuilder('r').where('r.is_deleted = false');
    if (branchId) q.andWhere('r.branch_id = :branchId', { branchId });
    if ((dto as any).reportType) q.andWhere('r.report_type = :type', { type: (dto as any).reportType });
    if (dto.search) q.andWhere('r.title ILIKE :s OR r.report_type ILIKE :s', { s: `%${dto.search}%` });
    q.orderBy('r.generated_at', 'DESC');
    return paginate(q, dto);
  }

  async findById(id: string) {
    const r = await this.repo.findOne({ where: { id, is_deleted: false } });
    if (!r) throw new NotFoundException(`Report ${id} not found`);
    return r;
  }

  async remove(id: string, uid?: string) {
    const r = await this.findById(id);
    r.is_deleted = true; r.deleted_at = new Date(); r.updated_by = uid;
    await this.repo.save(r);
    return { message: 'Report deleted' };
  }

  async getReportTypes(branchId: string) {
    return this.repo
      .createQueryBuilder('r')
      .select('r.report_type', 'type')
      .addSelect('COUNT(*)', 'count')
      .where('r.branch_id = :branchId AND r.is_deleted = false', { branchId })
      .groupBy('r.report_type')
      .getRawMany();
  }
}
