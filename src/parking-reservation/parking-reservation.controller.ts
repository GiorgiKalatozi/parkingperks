import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { CreateParkingReservationDto } from './create-parking-reservation.dto';
import { ParkingReservation } from './parking-reservation.entity';
import { ParkingReservationService } from './parking-reservation.service';

@Controller('parking-reservation')
@UseGuards(AuthGuard(), RolesGuard)
export class ParkingReservationController {
  constructor(
    private readonly parkingReservationService: ParkingReservationService,
  ) {}

  //   @Get()
  //   async getAllParkingReservations(): Promise<ParkingReservation[]> {
  //     return this.parkingReservationService.getAllParkingReservations();
  //   }

  //   @Get(':id')
  //   async getParkingReservationById(
  //     @Param('id') id: string,
  //   ): Promise<ParkingReservation> {
  //     return this.parkingReservationService.getParkingReservationById(id);
  //   }

  @Post()
  async createParkingReservation(
    @Body() createParkingReservationDto: CreateParkingReservationDto,
  ): Promise<ParkingReservation> {
    return this.parkingReservationService.createParkingReservation(
      createParkingReservationDto,
    );
  }

  //   @Put(':id')
  //   async updateParkingReservation(
  //     @Param('id') id: string,
  //     @Body() updateParkingReservationDto: UpdateParkingReservationDto,
  //   ): Promise<ParkingReservation> {
  //     return this.parkingReservationService.updateParkingReservation(
  //       id,
  //       updateParkingReservationDto,
  //     );
  //   }

  //   @Delete(':id')
  //   async deleteParkingReservation(@Param('id') id: string): Promise<void> {
  //     return this.parkingReservationService.deleteParkingReservation(id);
  //   }
}
