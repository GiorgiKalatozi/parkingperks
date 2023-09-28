import { ParkingReservation } from 'src/modules/parking-reservation/parking-reservation.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

@Entity()
export class ParkingZone {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @Column()
  address: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  parkingFeePerHour: number;

  @OneToMany(() => ParkingReservation, (reservation) => reservation.parkingZone)
  parkingReservations: ParkingReservation[];
}
