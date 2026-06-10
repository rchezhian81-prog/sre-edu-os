import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { BranchesService } from './branches.service';
import { CreateBranchDto } from './dto/create-branch.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Role } from '../../common/enums/roles.enum';

@ApiTags('Branches') @ApiBearerAuth() @UseGuards(JwtAuthGuard, RolesGuard)
@Controller('branches')
export class BranchesController {
  constructor(private svc: BranchesService) {}
  @Get() @ApiOperation({ summary: 'List branches' }) findAll(@Query() dto: PaginationDto) { return this.svc.findAll(dto); }
  @Get(':id') findOne(@Param('id') id: string) { return this.svc.findById(id); }
  @Post() @Roles(Role.OWNER) create(@Body() dto: CreateBranchDto, @CurrentUser('sub') uid: string) { return this.svc.create(dto, uid); }
  @Put(':id') @Roles(Role.OWNER) update(@Param('id') id: string, @Body() dto: CreateBranchDto, @CurrentUser('sub') uid: string) { return this.svc.update(id, dto, uid); }
  @Delete(':id') @Roles(Role.OWNER) remove(@Param('id') id: string, @CurrentUser('sub') uid: string) { return this.svc.remove(id, uid); }
}
