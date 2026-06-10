import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Role } from '../../common/enums/roles.enum';

@ApiTags('Users') @ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('users')
export class UsersController {
  constructor(private svc: UsersService) {}

  @Get() @Roles(Role.OWNER, Role.ADMIN)
  @ApiOperation({ summary: 'List all users (paginated)' })
  findAll(@Query() dto: PaginationDto, @CurrentUser('branchId') bId: string) { return this.svc.findAll(dto, bId); }

  @Get(':id') @Roles(Role.OWNER, Role.ADMIN)
  findOne(@Param('id') id: string) { return this.svc.findById(id); }

  @Post() @Roles(Role.OWNER, Role.ADMIN)
  create(@Body() dto: CreateUserDto, @CurrentUser('sub') uid: string) { return this.svc.create(dto, uid); }

  @Put(':id') @Roles(Role.OWNER, Role.ADMIN)
  update(@Param('id') id: string, @Body() dto: UpdateUserDto, @CurrentUser('sub') uid: string) { return this.svc.update(id, dto, uid); }

  @Delete(':id') @Roles(Role.OWNER)
  remove(@Param('id') id: string, @CurrentUser('sub') uid: string) { return this.svc.remove(id, uid); }
}
