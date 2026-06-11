import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransportRoute } from './transport.entity';
import { TransportController } from './transport.controller';
import { TransportService } from './transport.service';

@Module({
  imports: [TypeOrmModule.forFeature([TransportRoute])],
  controllers: [TransportController],
  providers: [TransportService],
  exports: [TransportService],
})
export class TransportModule {}
