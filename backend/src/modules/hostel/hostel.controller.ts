import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { HostelService } from './hostel.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { BranchId } from '../../common/decorators/branch.decorator';
import { Role } from '../../common/enums/roles.enum';
import { PaginationDto } from '../../common/dto/pagination.dto';

@ApiTags('Hostel') @ApiBearerAuth() @UseGuards(JwtAuthGuard, RolesGuard)
@Controller('hostel')
export class HostelController {
  constructor(private svc: HostelService) {}

  @Get() @ApiOperation({ summary: 'List all hostel rooms' })
  findAll(@Query() dto: PaginationDto, @BranchId() bId: string) { return this.svc.findAll(dto, bId); }

  @Get('stats') @Roles(Role.OWNER, Role.ADMIN, Role.PRINCIPAL)
  stats(@BranchId() bId: string) { return this.svc.getStats(bId); }

  @Get(':id') findOne(@Param('id') id: string) { return this.svc.findById(id); }

  @Post() @Roles(Role.OWNER, Role.ADMIN)
  create(@Body() body: any, @CurrentUser('sub') uid: string) { return this.svc.create(body, uid); }

  @Put(':id') @Roles(Role.OWNER, Role.ADMIN)
  update(@Param('id') id: string, @Body() body: any, @CurrentUser('sub') uid: string) { return this.svc.update(id, body, uid); }

  @Put(':id/allocate') @Roles(Role.OWNER, Role.ADMIN)
  @ApiOperation({ summary: 'Allocate a bed in the room' })
  allocate(@Param('id') id: string, @CurrentUser('sub') uid: string) { return this.svc.allocate(id, uid); }

  @Put(':id/vacate') @Roles(Role.OWNER, Role.ADMIN)
  @ApiOperation({ summary: 'Vacate a bed in the room' })
  vacate(@Param('id') id: string, @CurrentUser('sub') uid: string) { return this.svc.vacate(id, uid); }

  @Delete(':id') @Roles(Role.OWNER, Role.ADMIN)
  remove(@Param('id') id: string, @CurrentUser('sub') uid: string) { return this.svc.remove(id, uid); }
}
