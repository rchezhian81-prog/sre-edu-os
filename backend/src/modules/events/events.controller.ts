import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { EventsService } from './events.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { BranchId } from '../../common/decorators/branch.decorator';
import { Role } from '../../common/enums/roles.enum';
import { PaginationDto } from '../../common/dto/pagination.dto';

@ApiTags('Events & Calendar') @ApiBearerAuth() @UseGuards(JwtAuthGuard, RolesGuard)
@Controller('events')
export class EventsController {
  constructor(private svc: EventsService) {}

  @Get() @ApiOperation({ summary: 'List all events' })
  findAll(@Query() dto: PaginationDto, @BranchId() bId: string) { return this.svc.findAll(dto, bId); }

  @Get('upcoming') @ApiOperation({ summary: 'Get upcoming events' })
  upcoming(@BranchId() bId: string, @Query('limit') limit?: number) { return this.svc.findUpcoming(bId, limit || 10); }

  @Get('holidays') @ApiOperation({ summary: 'Get all school holidays' })
  holidays(@BranchId() bId: string) { return this.svc.findHolidays(bId); }

  @Get(':id') findOne(@Param('id') id: string) { return this.svc.findById(id); }

  @Post() @Roles(Role.OWNER, Role.ADMIN, Role.PRINCIPAL)
  create(@Body() body: any, @CurrentUser('sub') uid: string) { return this.svc.create(body, uid); }

  @Put(':id') @Roles(Role.OWNER, Role.ADMIN, Role.PRINCIPAL)
  update(@Param('id') id: string, @Body() body: any, @CurrentUser('sub') uid: string) { return this.svc.update(id, body, uid); }

  @Delete(':id') @Roles(Role.OWNER, Role.ADMIN)
  remove(@Param('id') id: string, @CurrentUser('sub') uid: string) { return this.svc.remove(id, uid); }
}
