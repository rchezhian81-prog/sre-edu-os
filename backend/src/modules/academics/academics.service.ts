import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Class } from './class.entity';
import { Section } from './section.entity';
import { Subject } from './subject.entity';

@Injectable()
export class AcademicsService {
  constructor(
    @InjectRepository(Class) private classRepo: Repository<Class>,
    @InjectRepository(Section) private secRepo: Repository<Section>,
    @InjectRepository(Subject) private subRepo: Repository<Subject>,
  ) {}

  // Classes
  getClasses(branchId: string) { return this.classRepo.find({ where: { branch_id: branchId, is_deleted: false }, order: { level: 'ASC' } }); }
  createClass(dto: any, uid?: string) { return this.classRepo.save(this.classRepo.create({ ...dto, created_by: uid })); }
  async updateClass(id: string, dto: any) { await this.classRepo.update(id, dto); return this.classRepo.findOne({ where: { id } }); }
  async deleteClass(id: string) { await this.classRepo.update(id, { is_deleted: true }); return { message: 'Deleted' }; }

  // Sections
  getSections(classId: string) { return this.secRepo.find({ where: { class_id: classId, is_deleted: false }, order: { name: 'ASC' } }); }
  createSection(dto: any, uid?: string) { return this.secRepo.save(this.secRepo.create({ ...dto, created_by: uid })); }

  // Subjects
  getSubjects(branchId: string) { return this.subRepo.find({ where: { branch_id: branchId, is_deleted: false }, order: { name: 'ASC' } }); }
  createSubject(dto: any, uid?: string) { return this.subRepo.save(this.subRepo.create({ ...dto, created_by: uid })); }
  async updateSubject(id: string, dto: any) { await this.subRepo.update(id, dto); return this.subRepo.findOne({ where: { id } }); }
}
