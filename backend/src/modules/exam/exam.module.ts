import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExamController } from './exam.controller';
import { ExamService } from './exam.service';
import { ExamSchedule } from './exam-schedule.entity';
import { ExamResult } from './exam-result.entity';
@Module({ imports:[TypeOrmModule.forFeature([ExamSchedule, ExamResult])], controllers:[ExamController], providers:[ExamService], exports:[ExamService] })
export class ExamModule {}
