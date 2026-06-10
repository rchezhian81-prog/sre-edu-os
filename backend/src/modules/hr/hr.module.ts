import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LeaveRequest } from './hr.entity';
// TODO: Add controller and service when implementing
@Module({ imports:[TypeOrmModule.forFeature([LeaveRequest])], controllers:[], providers:[], exports:[] })
export class HrModule {}
