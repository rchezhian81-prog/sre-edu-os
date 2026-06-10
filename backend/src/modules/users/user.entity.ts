import { Entity, Column, Index, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import { Role } from '../../common/enums/roles.enum';
import { Exclude } from 'class-transformer';

@Entity('users')
export class User extends BaseEntity {
  @Column() full_name: string;
  @Column() @Index({ unique: true }) email: string;
  @Column() @Exclude() password_hash: string;
  @Column({ type: 'enum', enum: Role }) role: Role;
  @Column({ nullable: true }) phone: string;
  @Column({ nullable: true }) avatar_url: string;
  @Column({ default: true }) is_active: boolean;
  @Column({ type: 'uuid', nullable: true }) branch_id: string;
  @Column({ type: 'jsonb', nullable: true }) permissions: Record<string, boolean>;
  @Column({ nullable: true }) last_login_at: Date;
}
