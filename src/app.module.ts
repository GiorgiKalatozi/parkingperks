import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { configValidationSchema } from './configs/config.schema';
import { AdminModule } from './modules/admin/admin.module';
import { CarsModule } from './modules/cars/cars.module';
import { ParkingReservationModule } from './modules/parking-reservation/parking-reservation.module';
import { ParkingZoneModule } from './modules/parking-zone/parking-zone.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env'],
      isGlobal: true,
      validationSchema: configValidationSchema,
    }),
    AuthModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        type: 'postgres',
        autoLoadEntities: true,
        synchronize: true,
        host: configService.get('DB_HOST'),
        port: configService.get('DB_PORT'),
        username: configService.get('POSTGRES_USER'),
        password: configService.get('POSTGRES_PASSWORD'),
        database: configService.get('POSTGRES_DB_NAME'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
      }),
    }),
    CarsModule,
    ParkingZoneModule,
    AdminModule,
    ParkingReservationModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
