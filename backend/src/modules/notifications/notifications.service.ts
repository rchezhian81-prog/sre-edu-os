import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class NotificationsService {
  private logger = new Logger(NotificationsService.name);
  private transporter: nodemailer.Transporter;

  constructor(private config: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: config.get('SMTP_HOST'), port: config.get('SMTP_PORT'),
      auth: { user: config.get('SMTP_USER'), pass: config.get('SMTP_PASS') },
    });
  }

  async sendEmail(to: string, subject: string, html: string) {
    try {
      await this.transporter.sendMail({ from: this.config.get('SMTP_FROM'), to, subject, html });
      this.logger.log(`Email sent to ${to}`);
    } catch (err) { this.logger.error(`Email failed: ${err.message}`); }
  }

  async sendWhatsApp(phone: string, templateName: string, params: string[]) {
    const token = this.config.get('WA_ACCESS_TOKEN');
    const phoneId = this.config.get('WA_PHONE_ID');
    if (!token || !phoneId) { this.logger.warn('WhatsApp not configured'); return; }
    try {
      const res = await fetch(`https://graph.facebook.com/v18.0/${phoneId}/messages`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messaging_product: 'whatsapp', to: phone, type: 'template',
          template: { name: templateName, language: { code: 'en_IN' }, components: [{ type: 'body', parameters: params.map(p => ({ type: 'text', text: p })) }] },
        }),
      });
      this.logger.log(`WhatsApp sent to ${phone}: ${res.status}`);
    } catch (err) { this.logger.error(`WhatsApp failed: ${err.message}`); }
  }

  async sendFeeReminder(parentPhone: string, parentName: string, studentName: string, amount: number, dueDate: string) {
    return this.sendWhatsApp(parentPhone, 'fee_reminder', [parentName, studentName, `₹${amount}`, dueDate]);
  }

  async sendAttendanceAlert(parentPhone: string, parentName: string, studentName: string, date: string, status: string) {
    return this.sendWhatsApp(parentPhone, 'attendance_alert', [parentName, studentName, date, status]);
  }
}
