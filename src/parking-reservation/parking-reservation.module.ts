import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/auth/entities/user.entity';
import { Car } from 'src/cars/entities/car.entity';
import { ParkingZone } from 'src/parking-zone/parking-zone.entity';
import { ParkingReservationController } from './parking-reservation.controller';
import { ParkingReservation } from './parking-reservation.entity';
import { ParkingReservationService } from './parking-reservation.service';
import { ParkingUtilsService } from './parking-utils.service';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    TypeOrmModule.forFeature([ParkingReservation, User, Car, ParkingZone]),
  ],
  providers: [ParkingReservationService, ParkingUtilsService],
  controllers: [ParkingReservationController],
})
export class ParkingReservationModule {}
