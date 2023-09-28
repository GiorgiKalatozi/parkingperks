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
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UserRole } from 'src/auth/enums/user-role.enum';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { ParkingZone } from './parking-zone.entity';
import { CreateParkingZoneDto } from './create-parking-zone.dto';
import { ParkingZoneService } from './parking-zone.service';
import { UpdateParkingZoneDto } from './update-parking-zone.dto';

@Controller('parking-zone')
@UseGuards(AuthGuard(), RolesGuard)
export class ParkingZoneController {
  constructor(private readonly parkingZoneService: ParkingZoneService) {}

  @Get()
  @Roles(UserRole.ADMIN) // Only administrators can view all parking zones
  async getAllParkingZones(): Promise<ParkingZone[]> {
    return this.parkingZoneService.getAllParkingZone();
  }

  @Get(':id')
  @Roles(UserRole.ADMIN) // Only administrators can get one parking zone
  async getParkingZone(@Param('id') id: string): Promise<ParkingZone> {
    return this.parkingZoneService.getParkingZoneById(id);
  }

  @Post()
  @Roles(UserRole.ADMIN) // Only administrators can create parking zones
  async createParkingZone(
    @Body() createParkingZoneDto: CreateParkingZoneDto,
  ): Promise<ParkingZone> {
    return this.parkingZoneService.createParkingZone(createParkingZoneDto);
  }

  @Put(':id')
  @Roles(UserRole.ADMIN) // Only administrators can update parking zones
  async updateParkingZone(
    @Param('id') id: string,
    @Body() updateParkingZoneDto: UpdateParkingZoneDto,
  ): Promise<ParkingZone> {
    return this.parkingZoneService.updateParkingZone(id, updateParkingZoneDto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN) // Only administrators can delete parking zones
  async deleteParkingZone(@Param('id') id: string): Promise<void> {
    return this.parkingZoneService.deleteParkingZone(id);
  }
}
