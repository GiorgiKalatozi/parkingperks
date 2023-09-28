import { Module } from '@nestjs/common';
import { ParkingZoneService } from './parking-zone.service';
import { ParkingZoneController } from './parking-zone.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ParkingZone } from './parking-zone.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    ConfigModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get('JWT_EXPIRATION_TIME'),
        },
      }),
    }),
    TypeOrmModule.forFeature([ParkingZone]),
  ],
  providers: [ParkingZoneService],
  controllers: [ParkingZoneController],
})
export class ParkingZoneModule {}
