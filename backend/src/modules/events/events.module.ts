import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SchoolEvent } from './events.entity';
// TODO: Add controller and service when implementing
@Module({ imports:[TypeOrmModule.forFeature([SchoolEvent])], controllers:[], providers:[], exports:[] })
export class EventsModule {}
