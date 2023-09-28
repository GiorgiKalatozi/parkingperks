import { Module } from '@nestjs/common';
import { ParkingZoneService } from './parking-zone.service';
import { ParkingZoneController } from './parking-zone.controller';

@Module({
  providers: [ParkingZoneService],
  controllers: [ParkingZoneController]
})
export class ParkingZoneModule {}
