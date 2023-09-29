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
import { GetUser } from '../../common/decorators/get-user.decorator';
import { User } from '../auth/entities/user.entity';
import { RolesGuard } from '../auth/guards/roles.guard';
import { CreateParkingReservationDto } from './create-parking-reservation.dto';
import { ParkingReservation } from './parking-reservation.entity';
import { ParkingReservationService } from './parking-reservation.service';
import { UpdateParkingReservationDto } from './update-parking-reservation.dto';

@Controller('parking-reservation')
@UseGuards(AuthGuard(), RolesGuard)
export class ParkingReservationController {
  constructor(
    private readonly parkingReservationService: ParkingReservationService,
  ) {}

  @Get()
  async getAllParkingReservations(
    @GetUser() user: User,
  ): Promise<ParkingReservation[]> {
    return this.parkingReservationService.getAllParkingReservations(user);
  }

  @Get(':id')
  async getParkingReservation(
    @Param('id') id: string,
    @GetUser() user: User,
  ): Promise<ParkingReservation> {
    return this.parkingReservationService.getParkingReservation(id, user);
  }

  @Post()
  async createParkingReservation(
    @Body() createParkingReservationDto: CreateParkingReservationDto,
    @GetUser() user: User,
  ): Promise<ParkingReservation> {
    return this.parkingReservationService.createParkingReservation(
      createParkingReservationDto,
      user,
    );
  }

  @Put(':id')
  async updateParkingReservation(
    @Param('id') id: string,
    @Body() updateParkingReservationDto: UpdateParkingReservationDto,
    @GetUser() user: User,
  ): Promise<ParkingReservation> {
    return this.parkingReservationService.updateParkingReservation(
      id,
      updateParkingReservationDto,
      user,
    );
  }

  @Delete(':id')
  async deleteParkingReservation(
    @Param('id') id: string,
    @GetUser() user: User,
  ): Promise<void> {
    return this.parkingReservationService.deleteParkingReservation(id, user);
  }
}
