import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { User } from 'src/auth/entities/user.entity';
import { Repository } from 'typeorm';
import { CarDto } from './dtos/car.dto';
import { Car } from './entities/car.entity';

@Injectable()
export class CarsService {
  constructor(
    @InjectRepository(Car)
    private carsRepository: Repository<Car>,
  ) {}

  async getUserCars(@GetUser() user: User): Promise<Car[]> {
    try {
      return await this.carsRepository.find({ where: { user } });
    } catch (error) {
      throw new Error('Unable to fetch user cars');
    }
  }

  async getUserCar(@GetUser() user: User, id: string): Promise<Car> {
    try {
      const car = await this.carsRepository.findOne({
        where: {
          id,
          user: { id: user.id },
        },
      });

      if (!car) {
        throw new NotFoundException('Car not found');
      }

      return car;
    } catch (error) {
      throw new Error('Unable to fetch user car');
    }
  }

  async createCar(carDto: CarDto, @GetUser() user: User): Promise<Car> {
    try {
      const { name, type, licensePlate } = carDto;
      const car = this.carsRepository.create({
        name,
        type,
        licensePlate,
        user,
      });
      return await this.carsRepository.save(car);
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException(
          'Car with the same license plate already exists',
        );
      }
      throw new Error('Unable to create car');
    }
  }

  async updateCar(id: string, carDto: CarDto): Promise<Car> {
    try {
      const existingCar = await this.carsRepository.findOne({ where: { id } });

      if (!existingCar) {
        throw new NotFoundException('Car not found');
      }

      await this.carsRepository.update(id, carDto);
      return await this.carsRepository.findOne({ where: { id } });
    } catch (error) {
      throw new Error('Unable to update car');
    }
  }

  async deleteCar(id: string): Promise<void> {
    try {
      const result = await this.carsRepository.delete(id);

      if (result.affected === 0) {
        throw new NotFoundException('Car not found');
      }
    } catch (error) {
      throw new Error('Unable to delete car');
    }
  }
}
