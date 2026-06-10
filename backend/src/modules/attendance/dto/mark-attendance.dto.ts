import { IsUUID, IsDateString, IsArray, ValidateNested, IsEnum, IsOptional, IsString, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { AttendanceStatus } from '../../../common/enums/status.enum';

export class AttendanceEntryDto {
  @ApiProperty() @IsUUID() student_id: string;
  @ApiProperty({ enum: AttendanceStatus }) @IsEnum(AttendanceStatus) status: AttendanceStatus;
  @ApiPropertyOptional() @IsOptional() @IsString() remarks?: string;
}

export class MarkAttendanceDto {
  @ApiProperty() @IsUUID() class_id: string;
  @ApiPropertyOptional() @IsOptional() @IsUUID() section_id?: string;
  @ApiProperty() @IsDateString() date: string;
  @ApiPropertyOptional() @IsOptional() @IsNumber() period_no?: number;
  @ApiProperty({ type: [AttendanceEntryDto] }) @IsArray() @ValidateNested({ each: true }) @Type(() => AttendanceEntryDto) entries: AttendanceEntryDto[];
}
