import { Controller, Get, Post, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { FeesService } from './fees.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { BranchId } from '../../common/decorators/branch.decorator';
import { Role } from '../../common/enums/roles.enum';

@ApiTags('Fees') @ApiBearerAuth() @UseGuards(JwtAuthGuard, RolesGuard)
@Controller('fees')
export class FeesController {
  constructor(private svc: FeesService) {}

  @Get('structures') getStructures(@BranchId() bId: string) { return this.svc.getStructures(bId); }
  @Post('structures') @Roles(Role.OWNER, Role.ADMIN, Role.ACCOUNTANT)
  createStructure(@Body() dto: any, @BranchId() bId: string, @CurrentUser('sub') uid: string) {
    return this.svc.createStructure({ ...dto, branch_id: bId }, uid);
  }

  @Post('collect') @Roles(Role.ACCOUNTANT, Role.ADMIN, Role.OWNER)
  @ApiOperation({ summary: 'Collect fee payment and generate receipt' })
  collect(@Body() dto: any, @BranchId() bId: string, @CurrentUser('sub') uid: string) { return this.svc.collectPayment(dto, bId, uid); }

  @Get('student/:studentId') getStudentFees(@Param('studentId') id: string) { return this.svc.getStudentFees(id); }

  @Get('defaulters') @Roles(Role.ADMIN, Role.ACCOUNTANT, Role.PRINCIPAL, Role.OWNER)
  defaulters(@BranchId() bId: string, @Query('year') year: string) { return this.svc.getDefaulters(bId, year); }

  @Get('summary') @Roles(Role.ADMIN, Role.ACCOUNTANT, Role.OWNER)
  summary(@BranchId() bId: string, @Query('year') year: string) { return this.svc.getCollectionSummary(bId, year); }
}
