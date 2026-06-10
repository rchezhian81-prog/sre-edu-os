import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FeesController } from './fees.controller';
import { FeesService } from './fees.service';
import { FeeStructure } from './fee-structure.entity';
import { FeePayment } from './fee-payment.entity';
@Module({ imports:[TypeOrmModule.forFeature([FeeStructure, FeePayment])], controllers:[FeesController], providers:[FeesService], exports:[FeesService] })
export class FeesModule {}
