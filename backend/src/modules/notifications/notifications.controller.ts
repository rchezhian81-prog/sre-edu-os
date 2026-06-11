import { Controller, Get, Post, Put, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from './notifications.entity';
import { NotificationsService } from './notifications.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { BranchId } from '../../common/decorators/branch.decorator';
import { Role } from '../../common/enums/roles.enum';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { paginate } from '../../common/utils/pagination.util';

@ApiTags('Notifications') @ApiBearerAuth() @UseGuards(JwtAuthGuard, RolesGuard)
@Controller('notifications')
export class NotificationsController {
  constructor(
    private svc: NotificationsService,
    @InjectRepository(Notification) private repo: Repository<Notification>,
  ) {}

  @Get()
  @ApiOperation({ summary: 'List notifications for current user / branch' })
  findAll(@Query() dto: PaginationDto, @BranchId() bId: string, @CurrentUser('sub') uid: string) {
    const q = this.repo.createQueryBuilder('n')
      .where('n.is_deleted = false AND n.branch_id = :bId', { bId })
      .andWhere('(n.recipient_id = :uid OR n.recipient_id IS NULL)', { uid })
      .orderBy('n.created_at', 'DESC');
    return paginate(q, dto);
  }

  @Get('unread-count')
  @ApiOperation({ summary: 'Count unread notifications' })
  async unreadCount(@BranchId() bId: string, @CurrentUser('sub') uid: string) {
    const count = await this.repo.count({ where: { branch_id: bId, recipient_id: uid, is_read: false, is_deleted: false } });
    return { count };
  }

  @Put(':id/read')
  @ApiOperation({ summary: 'Mark notification as read' })
  async markRead(@Param('id') id: string, @CurrentUser('sub') uid: string) {
    const n = await this.repo.findOne({ where: { id } });
    if (n) { n.is_read = true; n.read_at = new Date(); n.updated_by = uid; await this.repo.save(n); }
    return { message: 'Marked as read' };
  }

  @Put('mark-all-read')
  @ApiOperation({ summary: 'Mark all notifications as read' })
  async markAllRead(@BranchId() bId: string, @CurrentUser('sub') uid: string) {
    await this.repo.createQueryBuilder()
      .update(Notification)
      .set({ is_read: true, read_at: new Date(), updated_by: uid })
      .where('branch_id = :bId AND recipient_id = :uid AND is_read = false', { bId, uid })
      .execute();
    return { message: 'All notifications marked as read' };
  }

  @Post('send-email') @Roles(Role.OWNER, Role.ADMIN, Role.PRINCIPAL)
  @ApiOperation({ summary: 'Send email notification' })
  sendEmail(@Body() body: { to: string; subject: string; html: string }) {
    return this.svc.sendEmail(body.to, body.subject, body.html);
  }

  @Post('send-whatsapp') @Roles(Role.OWNER, Role.ADMIN, Role.PRINCIPAL)
  @ApiOperation({ summary: 'Send WhatsApp notification' })
  sendWhatsApp(@Body() body: { phone: string; template: string; params: string[] }) {
    return this.svc.sendWhatsApp(body.phone, body.template, body.params);
  }
}
