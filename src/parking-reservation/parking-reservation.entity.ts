import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from 'src/auth/entities/user.entity';
import { Car } from 'src/cars/entities/car.entity';
import { ParkingZone } from 'src/parking-zone/parking-zone.entity';

@Entity()
export class ParkingReservation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  startTime: Date;

  @Column({ type: 'timestamp', nullable: true })
  endTime: Date;

  @Column({ type: 'float' })
  totalCost: number;

  @ManyToOne(() => User, (user) => user.parkingReservations, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Car, (car) => car.parkingReservations, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'car_id' })
  car: Car;

  @ManyToOne(() => ParkingZone, (zone) => zone.parkingReservations, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'parking_zone_id' })
  parkingZone: ParkingZone;
}
