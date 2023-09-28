import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { CreateParkingReservationDto } from './create-parking-reservation.dto';
import { ParkingReservation } from './parking-reservation.entity';
import { ParkingReservationService } from './parking-reservation.service';
import { UpdateParkingReservationDto } from './update-parking-reservation.dto';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { User } from 'src/auth/entities/user.entity';

@Controller('parking-reservation')
@UseGuards(AuthGuard(), RolesGuard)
export class ParkingReservationController {
  constructor(
    private readonly parkingReservationService: ParkingReservationService,
  ) {}

  @Get()
  async getAllParkingReservations(): Promise<ParkingReservation[]> {
    return this.parkingReservationService.getAllParkingReservations();
  }

  @Get('history/:userId')
  async getUserParkingHistory(@Param('userId') userId: string) {
    return this.parkingReservationService.getUserParkingHistory(userId);
  }

  @Get(':id')
  async getParkingReservationById(
    @Param('id') id: string,
  ): Promise<ParkingReservation> {
    return this.parkingReservationService.getParkingReservation(id);
  }

  @Post()
  async createParkingReservation(
    @Body() createParkingReservationDto: CreateParkingReservationDto,
    @GetUser() user: User,
  ): Promise<ParkingReservation> {
    if (createParkingReservationDto.userId !== user.id) {
      throw new UnauthorizedException(
        "You are not authorized to create a reservation for this user's ID.",
      );
    }
    return this.parkingReservationService.createParkingReservation(
      createParkingReservationDto,
    );
  }

  @Put(':id')
  async updateParkingReservation(
    @Param('id') id: string,
    @Body() updateParkingReservationDto: UpdateParkingReservationDto,
  ): Promise<ParkingReservation> {
    return this.parkingReservationService.updateParkingReservation(
      id,
      updateParkingReservationDto,
    );
  }

  @Delete(':id')
  async deleteParkingReservation(@Param('id') id: string): Promise<void> {
    return this.parkingReservationService.deleteParkingReservation(id);
  }
}
