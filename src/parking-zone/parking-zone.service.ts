import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ParkingZone } from './parking-zone.entity';
import { CreateParkingZoneDto } from './create-parking-zone.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdateParkingZoneDto } from './update-parking-zone.dto';

@Injectable()
export class ParkingZoneService {
  constructor(
    @InjectRepository(ParkingZone)
    private parkingZoneRepository: Repository<ParkingZone>,
  ) {}

  async getAllParkingZone(): Promise<ParkingZone[]> {
    return this.parkingZoneRepository.find();
  }

  async getParkingZoneById(id: string): Promise<ParkingZone> {
    const parkingZone = await this.parkingZoneRepository.findOne({
      where: { id },
    });

    if (!parkingZone) {
      throw new NotFoundException('Parking zone not found.');
    }

    return parkingZone;
  }

  async createParkingZone(
    createParkingZoneDto: CreateParkingZoneDto,
  ): Promise<ParkingZone> {
    const { name, address, parkingFeePerHour } = createParkingZoneDto;

    // Check if a parking zone with the same name already exists
    const existingParkingZone = await this.parkingZoneRepository.findOne({
      where: { name },
    });

    if (existingParkingZone) {
      throw new ConflictException(
        'A parking zone with the same name already exists.',
      );
    }

    const parkingZone = this.parkingZoneRepository.create({
      name,
      address,
      parkingFeePerHour,
    });

    return this.parkingZoneRepository.save(parkingZone);
  }

  async updateParkingZone(
    id: string,
    updateParkingZoneDto: UpdateParkingZoneDto,
  ): Promise<ParkingZone> {
    const { name, address, parkingFeePerHour } = updateParkingZoneDto;

    // Check if the parking zone with the given ID exists
    const parkingZone = await this.parkingZoneRepository.findOne({
      where: { id },
    });

    if (!parkingZone) {
      throw new NotFoundException('Parking zone not found.');
    }

    // Check if a parking zone with the same name already exists
    const existingParkingZone = await this.parkingZoneRepository.findOne({
      where: { name },
    });

    if (existingParkingZone && existingParkingZone.id !== id) {
      throw new ConflictException(
        'A parking zone with the same name already exists.',
      );
    }

    parkingZone.name = name;
    parkingZone.address = address;
    parkingZone.parkingFeePerHour = parkingFeePerHour;

    return this.parkingZoneRepository.save(parkingZone);
  }

  async deleteParkingZone(id: string): Promise<void> {
    const parkingZone = await this.parkingZoneRepository.findOne({
      where: { id },
    });

    if (!parkingZone) {
      throw new NotFoundException('Parking zone not found.');
    }

    await this.parkingZoneRepository.remove(parkingZone);
  }
}
