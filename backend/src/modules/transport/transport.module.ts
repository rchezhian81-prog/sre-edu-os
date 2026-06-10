import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransportRoute } from './transport.entity';
// TODO: Add controller and service when implementing
@Module({ imports:[TypeOrmModule.forFeature([TransportRoute])], controllers:[], providers:[], exports:[] })
export class TransportModule {}
