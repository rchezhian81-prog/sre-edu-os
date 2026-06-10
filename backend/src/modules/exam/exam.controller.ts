import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { ExamService } from './exam.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { BranchId } from '../../common/decorators/branch.decorator';
import { Role } from '../../common/enums/roles.enum';

@ApiTags('Exam') @ApiBearerAuth() @UseGuards(JwtAuthGuard, RolesGuard)
@Controller('exams')
export class ExamController {
  constructor(private svc: ExamService) {}

  @Get('schedules') getSchedules(@BranchId() bId: string) { return this.svc.getSchedules(bId); }
  @Post('schedules') @Roles(Role.ADMIN, Role.PRINCIPAL, Role.OWNER)
  createSchedule(@Body() dto: any, @BranchId() bId: string, @CurrentUser('sub') uid: string) { return this.svc.createSchedule({ ...dto, branch_id: bId }, uid); }

  @Post(':examId/results') @Roles(Role.TEACHER, Role.ADMIN, Role.PRINCIPAL)
  enterResults(@Param('examId') eid: string, @Body() body: any, @CurrentUser('sub') uid: string, @BranchId() bId: string) {
    return this.svc.enterResults(eid, body.results, uid, bId);
  }

  @Get(':examId/results') getClassResults(@Param('examId') eid: string) { return this.svc.getClassResults(eid); }
  @Get('student/:studentId/results') getStudentResults(@Param('studentId') sid: string) { return this.svc.getStudentResults(sid); }
  @Get('student/:studentId/report-card/:examId')
  reportCard(@Param('studentId') sid: string, @Param('examId') eid: string) { return this.svc.getReportCard(sid, eid); }
}
