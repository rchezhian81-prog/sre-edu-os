import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { TimetableService } from './timetable.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { BranchId } from '../../common/decorators/branch.decorator';
import { Role } from '../../common/enums/roles.enum';

@ApiTags('Timetable') @ApiBearerAuth() @UseGuards(JwtAuthGuard, RolesGuard)
@Controller('timetable')
export class TimetableController {
  constructor(private svc: TimetableService) {}

  @Get()
  @ApiOperation({ summary: 'Get timetable (filter by class, section, day)' })
  @ApiQuery({ name: 'classId', required: false })
  @ApiQuery({ name: 'sectionId', required: false })
  @ApiQuery({ name: 'dayOfWeek', required: false })
  findAll(
    @BranchId() bId: string,
    @Query('classId') classId?: string,
    @Query('sectionId') sectionId?: string,
    @Query('dayOfWeek') dayOfWeek?: string,
  ) { return this.svc.findAll(bId, classId, sectionId, dayOfWeek); }

  @Get(':id') findOne(@Param('id') id: string) { return this.svc.findById(id); }

  @Post() @Roles(Role.OWNER, Role.ADMIN, Role.PRINCIPAL)
  create(@Body() body: any, @CurrentUser('sub') uid: string) { return this.svc.create(body, uid); }

  @Post('bulk') @Roles(Role.OWNER, Role.ADMIN, Role.PRINCIPAL)
  @ApiOperation({ summary: 'Bulk create timetable entries' })
  bulkCreate(@Body() body: any[], @CurrentUser('sub') uid: string) { return this.svc.bulkCreate(body, uid); }

  @Put(':id') @Roles(Role.OWNER, Role.ADMIN, Role.PRINCIPAL)
  update(@Param('id') id: string, @Body() body: any, @CurrentUser('sub') uid: string) { return this.svc.update(id, body, uid); }

  @Delete(':id') @Roles(Role.OWNER, Role.ADMIN)
  remove(@Param('id') id: string, @CurrentUser('sub') uid: string) { return this.svc.remove(id, uid); }
}
