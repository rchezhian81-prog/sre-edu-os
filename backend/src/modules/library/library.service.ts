import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LibraryBook } from './library.entity';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { paginate } from '../../common/utils/pagination.util';

@Injectable()
export class LibraryService {
  constructor(@InjectRepository(LibraryBook) private repo: Repository<LibraryBook>) {}

  create(data: Partial<LibraryBook>, uid?: string) {
    return this.repo.save(this.repo.create({ ...data, created_by: uid }));
  }

  findAll(dto: PaginationDto, branchId?: string) {
    const q = this.repo.createQueryBuilder('b').where('b.is_deleted = false');
    if (branchId) q.andWhere('b.branch_id = :branchId', { branchId });
    if (dto.search) q.andWhere('b.title ILIKE :s OR b.author ILIKE :s OR b.isbn ILIKE :s', { s: `%${dto.search}%` });
    if ((dto as any).category) q.andWhere('b.category = :cat', { cat: (dto as any).category });
    q.orderBy('b.title', 'ASC');
    return paginate(q, dto);
  }

  async findById(id: string) {
    const b = await this.repo.findOne({ where: { id, is_deleted: false } });
    if (!b) throw new NotFoundException(`Book ${id} not found`);
    return b;
  }

  async update(id: string, data: Partial<LibraryBook>, uid?: string) {
    const b = await this.findById(id);
    return this.repo.save(Object.assign(b, data, { updated_by: uid }));
  }

  async remove(id: string, uid?: string) {
    const b = await this.findById(id);
    b.is_deleted = true; b.deleted_at = new Date(); b.updated_by = uid;
    await this.repo.save(b);
    return { message: 'Book removed' };
  }

  async issueBook(id: string, uid?: string) {
    const b = await this.findById(id);
    if (b.available_copies < 1) throw new BadRequestException('No copies available');
    b.available_copies -= 1;
    b.updated_by = uid;
    return this.repo.save(b);
  }

  async returnBook(id: string, uid?: string) {
    const b = await this.findById(id);
    if (b.available_copies >= b.total_copies) throw new BadRequestException('All copies already returned');
    b.available_copies += 1;
    b.updated_by = uid;
    return this.repo.save(b);
  }

  async getStats(branchId: string) {
    const total = await this.repo.count({ where: { branch_id: branchId, is_deleted: false } });
    const result = await this.repo
      .createQueryBuilder('b')
      .select('SUM(b.total_copies)', 'totalCopies')
      .addSelect('SUM(b.available_copies)', 'availableCopies')
      .where('b.branch_id = :branchId AND b.is_deleted = false', { branchId })
      .getRawOne();
    return { totalBooks: total, totalCopies: +result.totalCopies || 0, availableCopies: +result.availableCopies || 0, issuedCopies: (+result.totalCopies || 0) - (+result.availableCopies || 0) };
  }
}
