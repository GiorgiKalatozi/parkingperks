// car.entity.ts
import { User } from 'src/auth/entities/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { CarType } from '../enums/car.enum';
import { Exclude } from 'class-transformer';
import { ParkingReservation } from 'src/parking-reservation/parking-reservation.entity';

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
