import { Car } from 'src/cars/entities/car.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 100.0 })
  virtualBalance: number;

  @OneToMany(() => Car, (car) => car.user, { eager: true })
  cars: Car[];
}
