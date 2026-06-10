import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HostelRoom } from './hostel.entity';
// TODO: Add controller and service when implementing
@Module({ imports:[TypeOrmModule.forFeature([HostelRoom])], controllers:[], providers:[], exports:[] })
export class HostelModule {}
