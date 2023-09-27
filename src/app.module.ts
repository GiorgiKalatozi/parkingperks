import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { configValidationSchema } from './configs/config.schema';
import { CarsModule } from './cars/cars.module';

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
    // TypeOrmModule.forRoot({
    //   type: 'postgres',
    //   host: 'postgres',
    //   port: 5432,
    //   username: 'postgres',
    //   password: 'postgres',
    //   database: 'parkingperks',
    //   entities: [__dirname + '/**/*.entity{.ts,.js}'],
    //   autoLoadEntities: true,
    //   synchronize: true,
    // }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
