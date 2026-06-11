import { Controller, Get, Post, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { ReportsService } from './reports.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { BranchId } from '../../common/decorators/branch.decorator';
import { Role } from '../../common/enums/roles.enum';
import { PaginationDto } from '../../common/dto/pagination.dto';

@ApiTags('Reports') @ApiBearerAuth() @UseGuards(JwtAuthGuard, RolesGuard)
@Controller('reports')
export class ReportsController {
  constructor(private svc: ReportsService) {}

  @Get() @ApiOperation({ summary: 'List saved reports' })
  @Roles(Role.OWNER, Role.ADMIN, Role.PRINCIPAL, Role.ACCOUNTANT)
  findAll(@Query() dto: PaginationDto, @BranchId() bId: string) { return this.svc.findAll(dto, bId); }

  @Get('types') @Roles(Role.OWNER, Role.ADMIN, Role.PRINCIPAL)
  reportTypes(@BranchId() bId: string) { return this.svc.getReportTypes(bId); }

  @Get(':id') @Roles(Role.OWNER, Role.ADMIN, Role.PRINCIPAL, Role.ACCOUNTANT)
  findOne(@Param('id') id: string) { return this.svc.findById(id); }

  @Post() @Roles(Role.OWNER, Role.ADMIN, Role.PRINCIPAL, Role.ACCOUNTANT)
  @ApiOperation({ summary: 'Save a generated report record' })
  create(@Body() body: any, @CurrentUser('sub') uid: string) { return this.svc.create(body, uid); }

  @Delete(':id') @Roles(Role.OWNER, Role.ADMIN)
  remove(@Param('id') id: string, @CurrentUser('sub') uid: string) { return this.svc.remove(id, uid); }
}
