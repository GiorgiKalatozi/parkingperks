import { IsNotEmpty, IsString, IsNumber, Min, Max } from 'class-validator';
import { PrimaryGeneratedColumn } from 'typeorm';

export class CreateParkingZoneDto {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  address: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(0, { message: 'Parking fee per hour must be at least 0' })
  @Max(1000, { message: 'Parking fee per hour cannot exceed 1000' })
  parkingFeePerHour: number;
}
