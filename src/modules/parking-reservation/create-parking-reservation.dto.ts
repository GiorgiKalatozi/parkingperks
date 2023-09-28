import { IsISO8601, IsNotEmpty, IsUUID } from 'class-validator';

export class CreateParkingReservationDto {
  @IsNotEmpty()
  @IsISO8601({ strict: true }, { message: 'Invalid date format' })
  startTime: string;

  @IsNotEmpty()
  @IsISO8601({ strict: true }, { message: 'Invalid date format' })
  endTime: string;

  @IsUUID()
  @IsNotEmpty()
  userId: string;

  @IsUUID()
  @IsNotEmpty()
  zoneId: string;

  @IsUUID()
  @IsNotEmpty()
  carId: string;

  durationInMinutes: number;

  parkingFeePerHour: number;
}
