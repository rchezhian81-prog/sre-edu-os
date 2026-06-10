import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LibraryBook } from './library.entity';
// TODO: Add controller and service when implementing
@Module({ imports:[TypeOrmModule.forFeature([LibraryBook])], controllers:[], providers:[], exports:[] })
export class LibraryModule {}
