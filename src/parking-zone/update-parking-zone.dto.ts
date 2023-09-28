import { IsString, IsNumber, Min, Max, IsOptional } from 'class-validator';

export class UpdateParkingZoneDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsNumber()
  @Min(0, { message: 'Parking fee per hour must be at least 0' })
  @Max(1000, { message: 'Parking fee per hour cannot exceed 1000' })
  parkingFeePerHour?: number;
}
