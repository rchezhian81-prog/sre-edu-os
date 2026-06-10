import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AcademicsController } from './academics.controller';
import { AcademicsService } from './academics.service';
import { Class } from './class.entity';
import { Section } from './section.entity';
import { Subject } from './subject.entity';
@Module({ imports:[TypeOrmModule.forFeature([Class, Section, Subject])], controllers:[AcademicsController], providers:[AcademicsService], exports:[AcademicsService] })
export class AcademicsModule {}
