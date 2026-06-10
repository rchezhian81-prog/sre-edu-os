import { IsString, IsOptional, IsEnum, IsUUID, IsDateString, IsEmail } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Status, Gender } from '../../../common/enums/status.enum';

export class CreateStudentDto {
  @ApiProperty() @IsString() full_name: string;
  @ApiProperty() @IsString() admission_no: string;
  @ApiPropertyOptional() @IsOptional() @IsString() roll_no?: string;
  @ApiPropertyOptional({ enum: Gender }) @IsOptional() @IsEnum(Gender) gender?: Gender;
  @ApiPropertyOptional() @IsOptional() @IsDateString() date_of_birth?: string;
  @ApiProperty() @IsUUID() branch_id: string;
  @ApiPropertyOptional() @IsOptional() @IsUUID() class_id?: string;
  @ApiPropertyOptional() @IsOptional() @IsUUID() section_id?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() parent_name?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() parent_phone?: string;
  @ApiPropertyOptional() @IsOptional() @IsEmail() parent_email?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() address?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() blood_group?: string;
  @ApiPropertyOptional() @IsOptional() @IsDateString() admission_date?: string;
  @ApiPropertyOptional({ enum: Status }) @IsOptional() @IsEnum(Status) status?: Status;
}
