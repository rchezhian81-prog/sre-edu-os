import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Staff } from './staff.entity';
@Module({ imports:[TypeOrmModule.forFeature([Staff])], controllers:[], providers:[], exports:[] })
export class StaffModule {}
