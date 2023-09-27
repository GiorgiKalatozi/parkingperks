// car.entity.ts
import { User } from 'src/auth/entities/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { CarType } from '../enums/car.enum';
import { Exclude } from 'class-transformer';

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

  @ManyToOne(() => User, (user) => user.cars, { eager: false })
  @Exclude({ toPlainOnly: true })
  user: User;
}
