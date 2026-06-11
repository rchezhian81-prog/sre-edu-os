import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Timetable } from './timetable.entity';

@Injectable()
export class TimetableService {
  constructor(@InjectRepository(Timetable) private repo: Repository<Timetable>) {}

  create(data: Partial<Timetable>, uid?: string) {
    return this.repo.save(this.repo.create({ ...data, created_by: uid }));
  }

  findAll(branchId?: string, classId?: string, sectionId?: string, dayOfWeek?: string) {
    const q = this.repo.createQueryBuilder('t').where('t.is_deleted = false');
    if (branchId) q.andWhere('t.branch_id = :branchId', { branchId });
    if (classId) q.andWhere('t.class_id = :classId', { classId });
    if (sectionId) q.andWhere('t.section_id = :sectionId', { sectionId });
    if (dayOfWeek) q.andWhere('t.day_of_week = :dayOfWeek', { dayOfWeek });
    q.orderBy('t.day_of_week', 'ASC').addOrderBy('t.period_no', 'ASC');
    return q.getMany();
  }

  async findById(id: string) {
    const t = await this.repo.findOne({ where: { id, is_deleted: false } });
    if (!t) throw new NotFoundException(`Timetable entry ${id} not found`);
    return t;
  }

  async update(id: string, data: Partial<Timetable>, uid?: string) {
    const t = await this.findById(id);
    return this.repo.save(Object.assign(t, data, { updated_by: uid }));
  }

  async remove(id: string, uid?: string) {
    const t = await this.findById(id);
    t.is_deleted = true; t.deleted_at = new Date(); t.updated_by = uid;
    await this.repo.save(t);
    return { message: 'Timetable entry removed' };
  }

  async bulkCreate(entries: Partial<Timetable>[], uid?: string) {
    const records = entries.map(e => this.repo.create({ ...e, created_by: uid }));
    return this.repo.save(records);
  }
}
