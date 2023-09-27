import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { User } from 'src/auth/entities/user.entity';
import { CarsService } from './cars.service';
import { CarDto } from './dtos/car.dto';
import { Car } from './entities/car.entity';

@Controller('cars')
@UseGuards(AuthGuard())
export class CarsController {
  constructor(private carsService: CarsService) {}

  @Get()
  async getUserCars(@GetUser() user: User): Promise<Car[]> {
    return this.carsService.getUserCars(user);
  }

  @Get(':id')
  async getUserCar(
    @Param('id') id: string,
    @GetUser() user: User,
  ): Promise<Car> {
    return this.carsService.getUserCar(user, id);
  }

  @Post()
  async createCar(@Body() carDto: CarDto, @GetUser() user: User): Promise<Car> {
    return this.carsService.createCar(carDto, user);
  }

  @Put(':id')
  async updateCar(
    @Param('id') id: string,
    @Body() carDto: CarDto,
  ): Promise<Car> {
    return this.carsService.updateCar(id, carDto);
  }

  @Delete(':id')
  async deleteCar(@Param('id') id: string): Promise<void> {
    return this.carsService.deleteCar(id);
  }
}
