import { Injectable } from '@nestjs/common';

@Injectable()
export class ParkingUtilsService {
  calculatedTotalCost(
    startTime: Date,
    endTime: Date,
    parkingFeePerHour: number,
  ): number {
    // Calculate the duration in hours
    const durationInHours =
      (endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60);

    // Calculate the total cost based on duration and parking fee per hour
    const totalCost = parseInt(
      (durationInHours * parkingFeePerHour).toFixed(2),
    );

    return totalCost;
  }

  calculatedStartTime(): Date {
    return new Date();
  }

  calculatedEndTime(startTime: Date, durationInMinutes: number): Date {
    const endTime = new Date(
      startTime.getTime() + durationInMinutes * 60 * 1000,
    );
    return endTime;
  }
}
