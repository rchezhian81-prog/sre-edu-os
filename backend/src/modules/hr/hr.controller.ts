import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { HrService } from './hr.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { BranchId } from '../../common/decorators/branch.decorator';
import { Role } from '../../common/enums/roles.enum';
import { PaginationDto } from '../../common/dto/pagination.dto';

@ApiTags('HR / Leave Management') @ApiBearerAuth() @UseGuards(JwtAuthGuard, RolesGuard)
@Controller('hr')
export class HrController {
  constructor(private svc: HrService) {}

  @Get('leave-requests') @ApiOperation({ summary: 'List leave requests' })
  findAll(@Query() dto: PaginationDto, @BranchId() bId: string) { return this.svc.findAll(dto, bId); }

  @Get('leave-requests/stats') @Roles(Role.OWNER, Role.ADMIN, Role.PRINCIPAL)
  stats(@BranchId() bId: string) { return this.svc.getStats(bId); }

  @Get('leave-requests/:id') findOne(@Param('id') id: string) { return this.svc.findById(id); }

  @Post('leave-requests') @ApiOperation({ summary: 'Submit leave request' })
  create(@Body() body: any, @CurrentUser('sub') uid: string) { return this.svc.create(body, uid); }

  @Put('leave-requests/:id/approve') @Roles(Role.OWNER, Role.ADMIN, Role.PRINCIPAL)
  @ApiOperation({ summary: 'Approve leave request' })
  approve(@Param('id') id: string, @CurrentUser('sub') uid: string) { return this.svc.approve(id, uid); }

  @Put('leave-requests/:id/reject') @Roles(Role.OWNER, Role.ADMIN, Role.PRINCIPAL)
  @ApiOperation({ summary: 'Reject leave request' })
  reject(@Param('id') id: string, @CurrentUser('sub') uid: string) { return this.svc.reject(id, uid); }

  @Put('leave-requests/:id/cancel')
  @ApiOperation({ summary: 'Cancel leave request' })
  cancel(@Param('id') id: string, @CurrentUser('sub') uid: string) { return this.svc.cancel(id, uid); }
}
