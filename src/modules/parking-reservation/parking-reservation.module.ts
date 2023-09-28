import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Car } from 'src/modules/cars/car.entity';
import { ParkingZone } from 'src/modules/parking-zone/parking-zone.entity';
import { User } from '../auth/entities/user.entity';
import { ParkingReservationController } from './parking-reservation.controller';
import { ParkingReservation } from './parking-reservation.entity';
import { ParkingReservationService } from './parking-reservation.service';
import { ParkingUtilsService } from './parking-utils.service';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    TypeOrmModule.forFeature([ParkingReservation, User, Car, ParkingZone]),
  ],
  providers: [ParkingReservationService, ParkingUtilsService],
  controllers: [ParkingReservationController],
})
export class ParkingReservationModule {}
