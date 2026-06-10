import { PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, Column, BeforeInsert, BeforeUpdate } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { Exclude } from 'class-transformer';

export abstract class BaseEntity {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Column({ default: false }) @Exclude() is_deleted: boolean;
  @Column({ nullable: true }) @Exclude() deleted_at: Date;
  @Column({ nullable: true }) @Exclude() created_by: string;
  @Column({ nullable: true }) @Exclude() updated_by: string;
  @CreateDateColumn() created_at: Date;
  @UpdateDateColumn() updated_at: Date;

  @BeforeInsert() generateId() { if (!this.id) this.id = uuidv4(); }
}
