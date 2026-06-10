import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { StudentsService } from './students.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { BranchId } from '../../common/decorators/branch.decorator';
import { Role } from '../../common/enums/roles.enum';

@ApiTags('Students') @ApiBearerAuth() @UseGuards(JwtAuthGuard, RolesGuard)
@Controller('students')
export class StudentsController {
  constructor(private svc: StudentsService) {}

  @Get() @ApiOperation({ summary: 'List students (paginated, filtered by branch)' })
  findAll(@Query() dto: PaginationDto, @BranchId() bId: string) { return this.svc.findAll(dto, bId); }

  @Get('stats') @Roles(Role.OWNER, Role.ADMIN, Role.PRINCIPAL)
  stats(@BranchId() bId: string) { return this.svc.getStats(bId); }

  @Get('by-class/:classId') @ApiQuery({ name: 'sectionId', required: false })
  byClass(@Param('classId') cId: string, @Query('sectionId') sId?: string) { return this.svc.findByClass(cId, sId); }

  @Get(':id') findOne(@Param('id') id: string) { return this.svc.findById(id); }

  @Post() @Roles(Role.OWNER, Role.ADMIN)
  create(@Body() dto: CreateStudentDto, @CurrentUser('sub') uid: string) { return this.svc.create(dto, uid); }

  @Put(':id') @Roles(Role.OWNER, Role.ADMIN)
  update(@Param('id') id: string, @Body() dto: CreateStudentDto, @CurrentUser('sub') uid: string) { return this.svc.update(id, dto, uid); }

  @Delete(':id') @Roles(Role.OWNER, Role.ADMIN)
  remove(@Param('id') id: string, @CurrentUser('sub') uid: string) { return this.svc.remove(id, uid); }
}
