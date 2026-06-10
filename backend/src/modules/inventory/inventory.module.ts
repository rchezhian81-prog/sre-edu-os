import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InventoryItem } from './inventory.entity';
// TODO: Add controller and service when implementing
@Module({ imports:[TypeOrmModule.forFeature([InventoryItem])], controllers:[], providers:[], exports:[] })
export class InventoryModule {}
