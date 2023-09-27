import { IsEnum, IsNotEmpty } from 'class-validator';
import { CarType } from '../enums/car.enum';

export class CreateCarDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  licensePlate: string;

  @IsNotEmpty()
  @IsEnum(CarType, {
    message: `Invalid car type. Must be one of ${Object.values(CarType).join(
      ', ',
    )}`,
  })
  type: CarType;
}
