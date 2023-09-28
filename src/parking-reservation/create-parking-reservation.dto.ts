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

  //   @IsNumber()
  //   @IsNotEmpty()
  //   @Min(0, { message: 'Total cost must be at least 0' })
  //   totalCost: number;

  // Placeholder for duration in minutes
  durationInMinutes: number;

  // Placeholder for parking fee per hour
  parkingFeePerHour: number;
}
