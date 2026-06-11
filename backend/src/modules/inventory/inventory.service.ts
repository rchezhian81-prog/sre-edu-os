import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InventoryItem } from './inventory.entity';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { paginate } from '../../common/utils/pagination.util';

@Injectable()
export class InventoryService {
  constructor(@InjectRepository(InventoryItem) private repo: Repository<InventoryItem>) {}

  create(data: Partial<InventoryItem>, uid?: string) {
    return this.repo.save(this.repo.create({ ...data, created_by: uid }));
  }

  findAll(dto: PaginationDto, branchId?: string) {
    const q = this.repo.createQueryBuilder('i').where('i.is_deleted = false');
    if (branchId) q.andWhere('i.branch_id = :branchId', { branchId });
    if (dto.search) q.andWhere('i.item_name ILIKE :s OR i.category ILIKE :s OR i.supplier ILIKE :s', { s: `%${dto.search}%` });
    if ((dto as any).category) q.andWhere('i.category = :cat', { cat: (dto as any).category });
    q.orderBy('i.item_name', 'ASC');
    return paginate(q, dto);
  }

  async findById(id: string) {
    const item = await this.repo.findOne({ where: { id, is_deleted: false } });
    if (!item) throw new NotFoundException(`Item ${id} not found`);
    return item;
  }

  async update(id: string, data: Partial<InventoryItem>, uid?: string) {
    const item = await this.findById(id);
    return this.repo.save(Object.assign(item, data, { updated_by: uid }));
  }

  async adjustStock(id: string, qty: number, uid?: string) {
    const item = await this.findById(id);
    const newQty = item.quantity + qty;
    if (newQty < 0) throw new BadRequestException('Stock cannot go below zero');
    item.quantity = newQty;
    item.updated_by = uid;
    return this.repo.save(item);
  }

  async remove(id: string, uid?: string) {
    const item = await this.findById(id);
    item.is_deleted = true; item.deleted_at = new Date(); item.updated_by = uid;
    await this.repo.save(item);
    return { message: 'Item removed' };
  }

  async getStats(branchId: string) {
    const total = await this.repo.count({ where: { branch_id: branchId, is_deleted: false } });
    const result = await this.repo
      .createQueryBuilder('i')
      .select('SUM(i.quantity * i.unit_price)', 'totalValue')
      .addSelect('SUM(i.quantity)', 'totalQty')
      .where('i.branch_id = :branchId AND i.is_deleted = false', { branchId })
      .getRawOne();
    const lowStock = await this.repo
      .createQueryBuilder('i')
      .where('i.branch_id = :branchId AND i.is_deleted = false AND i.quantity <= 5', { branchId })
      .getCount();
    return { totalItems: total, totalQuantity: +result.totalQty || 0, totalValue: +result.totalValue || 0, lowStockItems: lowStock };
  }
}
