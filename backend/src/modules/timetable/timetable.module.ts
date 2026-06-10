import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Timetable } from './timetable.entity';
// TODO: Add controller and service when implementing
@Module({ imports:[TypeOrmModule.forFeature([Timetable])], controllers:[], providers:[], exports:[] })
export class TimetableModule {}
