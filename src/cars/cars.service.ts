import { Injectable } from '@nestjs/common';
import { Car } from './entities/car.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCarDto } from './dtos/create-car.dto';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { User } from 'src/auth/entities/user.entity';

@Injectable()
export class CarsService {
  constructor(
    @InjectRepository(Car)
    private carsRepository: Repository<Car>,
  ) {}

  async createCar(
    createCarDto: CreateCarDto,
    @GetUser() user: User,
  ): Promise<Car> {
    const { name, type, licensePlate } = createCarDto;
    const car = this.carsRepository.create({ name, type, licensePlate, user });
    return this.carsRepository.save(car);
  }
}
