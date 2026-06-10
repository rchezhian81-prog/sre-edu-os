import { Entity, Column } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
@Entity('classes')
export class Class extends BaseEntity {
  @Column({ type: 'uuid' }) branch_id: string;
  @Column() name: string;
  @Column({ nullable: true }) level: number;
  @Column({ nullable: true }) stream: string;
  @Column({ nullable: true }) academic_year: string;
}
