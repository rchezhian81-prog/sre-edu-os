import { Module }            from '@nestjs/common';
import { TypeOrmModule }     from '@nestjs/typeorm';
import { HttpModule }        from '@nestjs/axios';
import { AiAnalyticsController } from './ai-analytics.controller';
import { AiAnalyticsService }    from './ai-analytics.service';
import { OpenAiService }         from './openai.service';
import { Student }           from '../students/entities/student.entity';
import { Attendance }        from '../attendance/entities/attendance.entity';
import { FeePayment }        from '../fees/entities/fee-payment.entity';
import { ExamResult }        from '../exam/entities/exam-result.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Student, Attendance, FeePayment, ExamResult]),
    HttpModule,
  ],
  controllers: [AiAnalyticsController],
  providers:   [AiAnalyticsService, OpenAiService],
  exports:     [AiAnalyticsService],
})
export class AiAnalyticsModule {}
