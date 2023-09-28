import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/entities/user.entity';
import { Car } from 'src/cars/entities/car.entity';
import { ParkingZone } from 'src/parking-zone/parking-zone.entity';
import { Repository } from 'typeorm';
import { CreateParkingReservationDto } from './create-parking-reservation.dto';
import { ParkingReservation } from './parking-reservation.entity';
import { ParkingUtilsService } from './parking-utils.service';
import { UpdateParkingReservationDto } from './update-parking-reservation.dto';

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

  async getAllParkingReservations(): Promise<ParkingReservation[]> {
    return await this.reservationRepository.find();
  }

  async getParkingReservation(
    reservationId: string,
  ): Promise<ParkingReservation> {
    const reservation = await this.reservationRepository.findOne({
      where: { id: reservationId },
    });

    if (!reservation) {
      throw new NotFoundException('Parking reservation not found');
    }

    return reservation;
  }

  async createParkingReservation(
    createParkingReservation: CreateParkingReservationDto,
  ) {
    const { userId, zoneId, carId } = createParkingReservation;

    const user = await this.usersRepository.findOne({
      where: { id: userId },
      select: ['id', 'username', 'role', 'virtualBalance', 'cars'],
    });

    if (!user) {
      throw new NotFoundException('User not found');
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
      createParkingReservation.durationInMinutes,
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
  ): Promise<ParkingReservation> {
    const reservation = await this.reservationRepository.findOne({
      where: { id: reservationId },
    });

    if (!reservation) {
      throw new NotFoundException('Reservation not found');
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
  async deleteParkingReservation(reservationId: string): Promise<void> {
    const reservation = await this.reservationRepository.findOne({
      where: { id: reservationId },
    });

    if (!reservation) {
      throw new NotFoundException('Parking reservation not found');
    }

    await this.reservationRepository.remove(reservation);
  }

  async getUserParkingHistory(userId: string): Promise<ParkingReservation[]> {
    const user = await this.usersRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user.parkingReservations;
  }
}
