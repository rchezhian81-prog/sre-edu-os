import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HostelRoom } from './hostel.entity';
import { HostelController } from './hostel.controller';
import { HostelService } from './hostel.service';

@Module({
  imports: [TypeOrmModule.forFeature([HostelRoom])],
  controllers: [HostelController],
  providers: [HostelService],
  exports: [HostelService],
})
export class HostelModule {}
