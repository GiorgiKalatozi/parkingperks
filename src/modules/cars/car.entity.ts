import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { ParkingReservation } from 'src/modules/parking-reservation/parking-reservation.entity';
import { User } from '../auth/entities/user.entity';
import { CarType } from './car.enum';

@Entity()
export class Car {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  licensePlate: string;

  @Column({ type: 'enum', enum: CarType })
  type: CarType;

  @ManyToOne(() => User, (user) => user.cars, {
    onDelete: 'CASCADE',
    eager: false,
  })
  @Exclude({ toPlainOnly: true })
  user: User;

  @OneToMany(() => ParkingReservation, (reservation) => reservation.car)
  parkingReservations: ParkingReservation[];
}
