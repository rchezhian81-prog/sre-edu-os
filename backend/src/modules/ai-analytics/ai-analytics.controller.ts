import {
  Controller, Get, Post, Body, UseGuards, HttpCode, HttpStatus, Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AiAnalyticsService }   from './ai-analytics.service';
import { JwtAuthGuard }         from '../../common/guards/jwt-auth.guard';
import { RolesGuard }           from '../../common/guards/roles.guard';
import { Roles }                from '../../common/decorators/roles.decorator';
import { Role }                 from '../../common/enums/roles.enum';
import { BranchId }             from '../../common/decorators/branch-id.decorator';
import { NlQueryDto }           from './dto/analytics.dto';
import { Throttle }             from '@nestjs/throttler';

@ApiTags('AI Analytics')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('ai-analytics')
export class AiAnalyticsController {
  constructor(private readonly svc: AiAnalyticsService) {}

  @Get('attendance-insights')
  @Roles(Role.OWNER, Role.ADMIN, Role.PRINCIPAL)
  @ApiOperation({ summary: 'GPT-4o attendance pattern analysis with narrative' })
  attendanceInsights(@BranchId() branchId: string) {
    return this.svc.attendanceInsights(branchId);
  }

  @Get('fee-risk')
  @Roles(Role.OWNER, Role.ADMIN, Role.ACCOUNTANT)
  @ApiOperation({ summary: 'Fee defaulter risk scoring for all students' })
  feeRisk(@BranchId() branchId: string) {
    return this.svc.feeRiskScoring(branchId);
  }

  @Get('performance-insights')
  @Roles(Role.OWNER, Role.ADMIN, Role.PRINCIPAL)
  @ApiOperation({ summary: 'Academic performance breakdown with weak-subject identification' })
  performanceInsights(@BranchId() branchId: string) {
    return this.svc.performanceInsights(branchId);
  }

  @Get('anomalies')
  @Roles(Role.OWNER, Role.ADMIN, Role.PRINCIPAL)
  @ApiOperation({ summary: 'Detect real-time anomalies in attendance, fees, and enrollment' })
  anomalies(@BranchId() branchId: string) {
    return this.svc.detectAnomalies(branchId);
  }

  @Post('query')
  @Roles(Role.OWNER, Role.ADMIN, Role.PRINCIPAL)
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { limit: 20, ttl: 60000 } })  // 20 AI queries per minute
  @ApiOperation({ summary: 'Ask a natural-language question about school data (GPT-4o)' })
  nlQuery(
    @BranchId() branchId: string,
    @Body() dto: NlQueryDto,
  ) {
    return this.svc.naturalLanguageQuery(branchId, dto);
  }
}
