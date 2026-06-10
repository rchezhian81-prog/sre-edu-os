import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcryptjs';
import { UsersService } from '../users/users.service';
import { LoginDto, ChangePasswordDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private config: ConfigService,
  ) {}

  async login(dto: LoginDto) {
    const user = await this.usersService.findByEmail(dto.email);
    if (!user || !(await bcrypt.compare(dto.password, user.password_hash)))
      throw new UnauthorizedException('Invalid email or password');
    if (!user.is_active) throw new UnauthorizedException('Account is inactive');

    const payload = { sub: user.id, email: user.email, role: user.role, branchId: user.branch_id };
    return {
      accessToken: this.jwtService.sign(payload),
      refreshToken: this.jwtService.sign(payload, {
        secret: this.config.get('JWT_REFRESH_SECRET'),
        expiresIn: this.config.get('JWT_REFRESH_EXPIRES_IN', '7d'),
      }),
      user: { id: user.id, email: user.email, fullName: user.full_name, role: user.role, branchId: user.branch_id, avatar: user.avatar_url },
    };
  }

  async refresh(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken, { secret: this.config.get('JWT_REFRESH_SECRET') });
      const user = await this.usersService.findById(payload.sub);
      const newPayload = { sub: user.id, email: user.email, role: user.role, branchId: user.branch_id };
      return { accessToken: this.jwtService.sign(newPayload) };
    } catch { throw new UnauthorizedException('Invalid refresh token'); }
  }

  async changePassword(userId: string, dto: ChangePasswordDto) {
    const user = await this.usersService.findById(userId);
    if (!(await bcrypt.compare(dto.currentPassword, user.password_hash)))
      throw new BadRequestException('Current password incorrect');
    await this.usersService.updatePassword(userId, dto.newPassword);
    return { message: 'Password updated successfully' };
  }

  async me(userId: string) {
    const user = await this.usersService.findById(userId);
    const { password_hash, ...safe } = user;
    return safe;
  }
}
