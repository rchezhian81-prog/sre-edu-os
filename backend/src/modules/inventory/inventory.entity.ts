import { Entity, Column } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
@Entity('inventory')
export class InventoryItem extends BaseEntity {
  @Column({ type: 'uuid' }) branch_id: string;
  @Column() item_name: string;
  @Column({ nullable: true }) category: string;
  @Column({ nullable: true }) unit: string;
  @Column({ default: 0 }) quantity: number;
  @Column({ nullable: true, type: 'decimal', precision: 10, scale: 2 }) unit_price: number;
  @Column({ nullable: true }) supplier: string;
  @Column({ nullable: true }) location: string;
}
