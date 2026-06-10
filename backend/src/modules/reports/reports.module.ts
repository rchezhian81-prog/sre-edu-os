import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SavedReport } from './reports.entity';
// TODO: Add controller and service when implementing
@Module({ imports:[TypeOrmModule.forFeature([SavedReport])], controllers:[], providers:[], exports:[] })
export class ReportsModule {}
