import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Worker } from '../auth/schemas/worker.schema';
import { Review } from '../user/entities/review.schema';

@Injectable()
export class TaskService {
  constructor(
    @InjectModel('Worker') private readonly workerModel: Model<Worker>,
    @InjectModel('Review') private readonly reviewModel: Model<Review>,
  ) {}

  @Cron('0 0 * * 0') // This cron expression means every Sunday at midnight
  async handleEvery10Minutes() {
    console.log('The Ratings has been updated');
    await this.updateWorkerRatings();
  }

  // @Cron('45 * * * * *')
  // async handleEvery45Seconds() {
  //   console.log('Task executed every 45 seconds');g
  //   await this.updateWorkerRatings();
  // }

  async updateWorkerRatings() {
    const workers = await this.reviewModel.aggregate([
      {
        $group: {
          _id: '$workerId',
          averageRating: { $avg: '$rating' },
          reviewCount: { $sum: 1 },
        },
      },
      {
        $match: {
          reviewCount: { $gt: 3 },
        },
      },
    ]);

    const bulkOps = workers.map((worker) => ({
      updateOne: {
        filter: { _id: worker._id },
        update: { rating: parseFloat(worker.averageRating.toFixed(1)) },
      },
    }));

    if (bulkOps.length > 0) {
      await this.workerModel.bulkWrite(bulkOps);
    }
  }
}
