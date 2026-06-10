import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { paginate } from '../../common/utils/pagination.util';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private repo: Repository<User>) {}

  async findByEmail(email: string) { return this.repo.findOne({ where: { email, is_deleted: false } }); }
  async findById(id: string) {
    const u = await this.repo.findOne({ where: { id, is_deleted: false } });
    if (!u) throw new NotFoundException(`User ${id} not found`);
    return u;
  }

  async create(dto: CreateUserDto, createdBy?: string) {
    const exists = await this.findByEmail(dto.email);
    if (exists) throw new ConflictException('Email already in use');
    const hash = await bcrypt.hash(dto.password, 12);
    const user = this.repo.create({ ...dto, password_hash: hash, created_by: createdBy });
    return this.repo.save(user);
  }

  async findAll(dto: PaginationDto, branchId?: string) {
    const q = this.repo.createQueryBuilder('u').where('u.is_deleted = false');
    if (branchId) q.andWhere('u.branch_id = :branchId', { branchId });
    if (dto.search) q.andWhere('u.full_name ILIKE :s OR u.email ILIKE :s', { s: `%${dto.search}%` });
    q.orderBy(`u.${dto.sortBy || 'created_at'}`, dto.sortOrder || 'DESC');
    return paginate(q, dto);
  }

  async update(id: string, dto: UpdateUserDto, updatedBy?: string) {
    const user = await this.findById(id);
    Object.assign(user, dto, { updated_by: updatedBy });
    return this.repo.save(user);
  }

  async updatePassword(id: string, password: string) {
    const hash = await bcrypt.hash(password, 12);
    await this.repo.update(id, { password_hash: hash });
  }

  async remove(id: string, deletedBy?: string) {
    const user = await this.findById(id);
    user.is_deleted = true; user.deleted_at = new Date(); user.updated_by = deletedBy;
    await this.repo.save(user);
    return { message: 'User deleted' };
  }
}
