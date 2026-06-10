import { Controller, Post, Get, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { AttendanceService } from './attendance.service';
import { MarkAttendanceDto } from './dto/mark-attendance.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { BranchId } from '../../common/decorators/branch.decorator';
import { Role } from '../../common/enums/roles.enum';

@ApiTags('Attendance') @ApiBearerAuth() @UseGuards(JwtAuthGuard, RolesGuard)
@Controller('attendance')
export class AttendanceController {
  constructor(private svc: AttendanceService) {}

  @Post('mark') @Roles(Role.TEACHER, Role.ADMIN, Role.PRINCIPAL)
  @ApiOperation({ summary: 'Mark attendance for a class (bulk)' })
  mark(@Body() dto: MarkAttendanceDto, @BranchId() bId: string, @CurrentUser('sub') uid: string) {
    return this.svc.markBulk(dto, bId, uid);
  }

  @Get('class/:classId') @ApiQuery({ name: 'date', required: true }) @ApiQuery({ name: 'sectionId', required: false })
  byClassDate(@Param('classId') cId: string, @Query('date') date: string, @Query('sectionId') sId?: string) {
    return this.svc.getByClassDate(cId, date, sId);
  }

  @Get('student/:studentId/monthly') @ApiQuery({ name: 'year', type: Number }) @ApiQuery({ name: 'month', type: Number })
  monthly(@Param('studentId') sid: string, @Query('year') y: number, @Query('month') m: number) {
    return this.svc.getStudentMonthly(sid, +y, +m);
  }

  @Get('at-risk') @Roles(Role.ADMIN, Role.PRINCIPAL, Role.OWNER)
  @ApiQuery({ name: 'threshold', required: false, description: 'Attendance % threshold (default 75)' })
  atRisk(@BranchId() bId: string, @Query('threshold') t?: number) { return this.svc.getAtRiskStudents(bId, t ? +t : 75); }
}
