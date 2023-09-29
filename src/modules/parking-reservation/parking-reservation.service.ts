import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../auth/entities/user.entity';
import { Car } from '../cars/car.entity';
import { ParkingZone } from '../parking-zone/parking-zone.entity';
import { CreateParkingReservationDto } from './create-parking-reservation.dto';
import { ParkingReservation } from './parking-reservation.entity';
import { ParkingUtilsService } from './parking-utils.service';
import { UpdateParkingReservationDto } from './update-parking-reservation.dto';
import { GetUser } from 'src/common/decorators/get-user.decorator';

@Injectable()
export class ParkingReservationService {
  constructor(
    @InjectRepository(ParkingReservation)
    private reservationRepository: Repository<ParkingReservation>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Car)
    private carRepository: Repository<Car>,
    @InjectRepository(ParkingZone)
    private parkingZoneRepository: Repository<ParkingZone>,
    private parkingUtilsService: ParkingUtilsService,
  ) {}

  async getAllParkingReservations(user: User): Promise<ParkingReservation[]> {
    return await this.reservationRepository.find({
      where: { user: user },
    });
  }

  async getParkingReservation(
    reservationId: string,
    user: User,
  ): Promise<ParkingReservation> {
    const reservation = await this.reservationRepository.findOne({
      where: { id: reservationId },
    });

    if (!reservation) {
      throw new NotFoundException('Parking reservation not found');
    }

    if (reservation.user.id !== user.id) {
      throw new UnauthorizedException(
        'You are not authorized to access this reservation.',
      );
    }

    return reservation;
  }

  async createParkingReservation(
    createParkingReservationDto: CreateParkingReservationDto,
    @GetUser() user: User,
  ) {
    const { userId, zoneId, carId } = createParkingReservationDto;

    if (userId !== user.id) {
      throw new UnauthorizedException(
        "You are not authorized to create a reservation for this user's ID.",
      );
    }

    const isUserCar = user.cars.some((car) => car.id === carId);
    if (!isUserCar) {
      throw new UnauthorizedException(
        'You are not authorized to create a reservation for this car.',
      );
    }

    const car = await this.carRepository.findOne({
      where: { id: carId },
    });

    if (!car) {
      throw new NotFoundException('Car not found');
    }

    const parkingZone = await this.parkingZoneRepository.findOne({
      where: { id: zoneId },
    });

    if (!parkingZone) {
      throw new NotFoundException('Parking Zone not found');
    }

    // Calculate startTime, endTime, and totalCost based on parking fee per hour and logic
    const calculatedStartTime = this.parkingUtilsService.calculatedStartTime();
    const calculatedEndTime = this.parkingUtilsService.calculatedEndTime(
      calculatedStartTime,
      createParkingReservationDto.durationInMinutes,
    );
    const calculatedTotalCost = this.parkingUtilsService.calculatedTotalCost(
      calculatedStartTime,
      calculatedEndTime,
      parkingZone.parkingFeePerHour,
    );

    // Check if the user has sufficient balance to make the reservation
    const sufficientBalance = user.virtualBalance >= calculatedTotalCost;

    if (!sufficientBalance) {
      throw new BadRequestException('Insufficient balance');
    }

    // Deduct cost from the user's balance
    user.virtualBalance -= calculatedTotalCost;

    // Save the updated user entity with the new virtualBalance
    await this.usersRepository.save(user);

    const reservation = this.reservationRepository.create({
      startTime: calculatedStartTime,
      endTime: calculatedEndTime,
      totalCost: calculatedTotalCost,
      user: user,
      parkingZone: parkingZone,
      car: car,
    });

    await this.reservationRepository.save(reservation);

    return reservation;
  }

  async updateParkingReservation(
    reservationId: string,
    updateReservationDto: UpdateParkingReservationDto,
    user: User,
  ): Promise<ParkingReservation> {
    const reservation = await this.reservationRepository.findOne({
      where: { id: reservationId },
    });

    if (!reservation) {
      throw new NotFoundException('Parking reservation not found.');
    }

    if (reservation.user.id !== user.id) {
      throw new UnauthorizedException(
        'You are not authorized to update this reservation.',
      );
    }

    if (updateReservationDto.startTime) {
      reservation.startTime = new Date(updateReservationDto.startTime);
    }

    if (updateReservationDto.endTime) {
      reservation.endTime = new Date(updateReservationDto.endTime);
    }

    if (updateReservationDto.userId) {
      reservation.user.id = updateReservationDto.userId;
    }

    if (updateReservationDto.zoneId) {
      reservation.parkingZone.id = updateReservationDto.zoneId;
    }

    if (updateReservationDto.carId) {
      reservation.car.id = updateReservationDto.carId;
    }

    await this.reservationRepository.save(reservation);

    return reservation;
  }
  async deleteParkingReservation(
    reservationId: string,
    user: User,
  ): Promise<void> {
    const reservation = await this.reservationRepository.findOne({
      where: { id: reservationId },
    });

    if (!reservation) {
      throw new NotFoundException('Parking reservation not found');
    }

    if (reservation.user.id !== user.id) {
      throw new UnauthorizedException(
        'You are not authorized to delete this reservation.',
      );
    }

    await this.reservationRepository.remove(reservation);
  }
}
