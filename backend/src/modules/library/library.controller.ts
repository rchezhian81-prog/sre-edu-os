import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { LibraryService } from './library.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { BranchId } from '../../common/decorators/branch.decorator';
import { Role } from '../../common/enums/roles.enum';
import { PaginationDto } from '../../common/dto/pagination.dto';

@ApiTags('Library') @ApiBearerAuth() @UseGuards(JwtAuthGuard, RolesGuard)
@Controller('library')
export class LibraryController {
  constructor(private svc: LibraryService) {}

  @Get() @ApiOperation({ summary: 'List all books' })
  findAll(@Query() dto: PaginationDto, @BranchId() bId: string) { return this.svc.findAll(dto, bId); }

  @Get('stats') @Roles(Role.OWNER, Role.ADMIN, Role.PRINCIPAL)
  stats(@BranchId() bId: string) { return this.svc.getStats(bId); }

  @Get(':id') findOne(@Param('id') id: string) { return this.svc.findById(id); }

  @Post() @Roles(Role.OWNER, Role.ADMIN, Role.LIBRARIAN)
  create(@Body() body: any, @CurrentUser('sub') uid: string) { return this.svc.create(body, uid); }

  @Put(':id') @Roles(Role.OWNER, Role.ADMIN, Role.LIBRARIAN)
  update(@Param('id') id: string, @Body() body: any, @CurrentUser('sub') uid: string) { return this.svc.update(id, body, uid); }

  @Post(':id/issue') @Roles(Role.OWNER, Role.ADMIN, Role.LIBRARIAN)
  @ApiOperation({ summary: 'Issue book (decrease available copies)' })
  issue(@Param('id') id: string, @CurrentUser('sub') uid: string) { return this.svc.issueBook(id, uid); }

  @Post(':id/return') @Roles(Role.OWNER, Role.ADMIN, Role.LIBRARIAN)
  @ApiOperation({ summary: 'Return book (increase available copies)' })
  returnBook(@Param('id') id: string, @CurrentUser('sub') uid: string) { return this.svc.returnBook(id, uid); }

  @Delete(':id') @Roles(Role.OWNER, Role.ADMIN)
  remove(@Param('id') id: string, @CurrentUser('sub') uid: string) { return this.svc.remove(id, uid); }
}
