import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { UserRole } from '../enums/user-role.enum';
import { ParkingReservation } from 'src/modules/parking-reservation/parking-reservation.entity';
import { Car } from 'src/modules/cars/car.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.USER })
  role: UserRole;

  @Column({ default: 100 }) // Initial virtual balance of 100 GEL
  virtualBalance: number;

  @OneToMany(() => Car, (car) => car.user, {
    cascade: true,
    onDelete: 'CASCADE',
    eager: true,
  })
  cars: Car[];

  @OneToMany(() => ParkingReservation, (reservation) => reservation.user, {
    onDelete: 'CASCADE',
  })
  parkingReservations: ParkingReservation[];
}
