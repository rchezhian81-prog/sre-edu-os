import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { AcademicsService } from './academics.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { BranchId } from '../../common/decorators/branch.decorator';
import { Role } from '../../common/enums/roles.enum';

@ApiTags('Academics') @ApiBearerAuth() @UseGuards(JwtAuthGuard, RolesGuard)
@Controller('academics')
export class AcademicsController {
  constructor(private svc: AcademicsService) {}

  @Get('classes') getClasses(@BranchId() bId: string) { return this.svc.getClasses(bId); }
  @Post('classes') @Roles(Role.ADMIN, Role.OWNER)
  createClass(@Body() dto: any, @BranchId() bId: string, @CurrentUser('sub') uid: string) { return this.svc.createClass({ ...dto, branch_id: bId }, uid); }
  @Put('classes/:id') @Roles(Role.ADMIN, Role.OWNER) updateClass(@Param('id') id: string, @Body() dto: any) { return this.svc.updateClass(id, dto); }
  @Delete('classes/:id') @Roles(Role.ADMIN, Role.OWNER) deleteClass(@Param('id') id: string) { return this.svc.deleteClass(id); }

  @Get('classes/:classId/sections') getSections(@Param('classId') cId: string) { return this.svc.getSections(cId); }
  @Post('sections') @Roles(Role.ADMIN, Role.OWNER)
  createSection(@Body() dto: any, @BranchId() bId: string, @CurrentUser('sub') uid: string) { return this.svc.createSection({ ...dto, branch_id: bId }, uid); }

  @Get('subjects') getSubjects(@BranchId() bId: string) { return this.svc.getSubjects(bId); }
  @Post('subjects') @Roles(Role.ADMIN, Role.OWNER)
  createSubject(@Body() dto: any, @BranchId() bId: string, @CurrentUser('sub') uid: string) { return this.svc.createSubject({ ...dto, branch_id: bId }, uid); }
  @Put('subjects/:id') @Roles(Role.ADMIN, Role.OWNER) updateSubject(@Param('id') id: string, @Body() dto: any) { return this.svc.updateSubject(id, dto); }
}
