import { IsISO8601, IsOptional, IsUUID } from 'class-validator';

export class UpdateParkingReservationDto {
  @IsOptional()
  @IsISO8601({ strict: true }, { message: 'Invalid date format' })
  startTime?: string;

  @IsOptional()
  @IsISO8601({ strict: true }, { message: 'Invalid date format' })
  endTime?: string;

  @IsOptional()
  @IsUUID()
  userId?: string;

  @IsOptional()
  @IsUUID()
  zoneId?: string;

  @IsOptional()
  @IsUUID()
  carId?: string;
}
