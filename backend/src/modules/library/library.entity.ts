import { Entity, Column } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
@Entity('library')
export class LibraryBook extends BaseEntity {
  @Column({ type: 'uuid' }) branch_id: string;
  @Column() title: string;
  @Column({ nullable: true }) author: string;
  @Column({ nullable: true }) isbn: string;
  @Column({ nullable: true }) category: string;
  @Column({ nullable: true }) publisher: string;
  @Column({ default: 1 }) total_copies: number;
  @Column({ default: 1 }) available_copies: number;
  @Column({ nullable: true }) rack_no: string;
}
