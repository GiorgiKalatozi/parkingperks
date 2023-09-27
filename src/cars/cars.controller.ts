import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { CarsService } from './cars.service';
import { CreateCarDto } from './dtos/create-car.dto';
import { Car } from './entities/car.entity';
import { AuthGuard } from '@nestjs/passport';
import { User } from 'src/auth/entities/user.entity';
import { GetUser } from 'src/auth/decorators/get-user.decorator';

@Controller('cars')
@UseGuards(AuthGuard())
export class CarsController {
  constructor(private carsService: CarsService) {}

  @Post()
  async createCar(
    @Body() createCarDto: CreateCarDto,
    @GetUser() user: User,
  ): Promise<Car> {
    return this.carsService.createCar(createCarDto, user);
  }
}
