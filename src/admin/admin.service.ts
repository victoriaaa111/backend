import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from "mongoose";
import { Admin } from '../auth/schemas/admin.schema';
import { JwtService } from '@nestjs/jwt';
import { User } from '../auth/schemas/user.schema';
import { Worker } from '../auth/schemas/worker.schema';
import { UpdateWorkerDto } from './dtos/update-worker.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UpdateRatingDto } from './dtos/worker-rating.dto';
import { Review } from '../user/entities/review.schema';

@Injectable()
export class AdminService {
  constructor(
    @InjectModel(Admin.name)
    private adminModel: Model<Admin>,
    @InjectModel(User.name) private UserModel: Model<User>,
    @InjectModel(Worker.name) private WorkerModel: Model<Worker>,
    @InjectModel(Review.name) private ReviewModel: Model<Review>,
    private jwtService: JwtService,
  ) {}

  async changeStatusUser(userId: string) {
    let user = await this.UserModel.findOne({ _id: userId });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    if (user.isActive === true) {
      user = await this.UserModel.findOneAndUpdate(
        { _id: userId },
        { isActive: false },
      );
    } else if (user.isActive === false) {
      user = await this.UserModel.findOneAndUpdate(
        { _id: userId },
        {
          isActive: true,
        },
      );
    }

    return {
      message: 'Status changed',
    };
  }

  async changeStatusWorker(workerId: string) {
    let worker = await this.WorkerModel.findOne({ _id: workerId });
    if (!worker) {
      throw new NotFoundException('Worker not found');
    }
    if (worker.isActive === true) {
      worker = await this.WorkerModel.findOneAndUpdate(
        { _id: workerId },
        { isActive: false },
      );
    } else if (worker.isActive === false) {
      worker = await this.WorkerModel.findOneAndUpdate(
        { _id: workerId },
        {
          isActive: true,
        },
      );
    }

    return {
      message: 'Status changed',
    };
  }

  async getUsers() {
    return this.UserModel.find();
  }

  async getWorkers() {
    return this.WorkerModel.find().populate({
      path: 'services',
      select: 'service description price',
    });
  }

  async updateWorker(id: string, updatedWorker: UpdateWorkerDto) {
    const worker = this.WorkerModel.findById(id);
    if (!worker) {
      throw new NotFoundException('Worker not found');
    }

    await this.WorkerModel.findByIdAndUpdate(id, updatedWorker, {
      new: true,
      useFindAndModify: false,
    });
    return { message: 'Worker updated' };
  }

  async updateUser(id: string, updatedUser: UpdateUserDto) {
    const user = this.UserModel.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    await this.UserModel.findByIdAndUpdate(id, updatedUser, {
      new: true,
      useFindAndModify: false,
    });
    return { message: 'User updated' };
  }

  async updateRating(id: string, rating: UpdateRatingDto) {
    const worker = this.WorkerModel.findById(id);
    if (!worker) {
      throw new NotFoundException('Worker not found');
    }
    await this.WorkerModel.findByIdAndUpdate(id, rating, {
      new: true,
      useFindAndModify: false,
    });
    console.log(rating);
    return { message: 'Rating updated' };
  }

  async getReviews(id: ObjectId) {
    const reviews = this.ReviewModel.find({ workerId: id });
    if (!reviews) {
      throw new NotFoundException('Reviews not found');
    }

    return reviews
      .populate({ path: 'userId', select: 'fullName' })
      .populate({ path: 'orderId', select: 'service' });
  }

  async getWorkersWith0Rating() {
    return this.WorkerModel.find({ rating: 0 });
  }

  async editReview(id: ObjectId, updatedRating: UpdateRatingDto) {
    const review = await this.ReviewModel.findByIdAndUpdate(id, updatedRating);
    if (!review) {
      throw new NotFoundException('Review not found');
    }
    const worker = await this.ReviewModel.aggregate([
      {
        $match: {
          workerId: id,
        },
      },
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

    // Check if the worker exists and has more than 3 reviews
    if (worker.length > 0) {
      const workerData = worker[0];
      const bulkOps = [
        {
          updateOne: {
            filter: { _id: workerData._id },
            update: { rating: parseFloat(workerData.averageRating.toFixed(1)) },
          },
        },
      ];

      if (bulkOps.length > 0) {
        await this.WorkerModel.bulkWrite(bulkOps);
      }
    }
    return { message: 'Review edited' };
  }

  async deleteReview(id: ObjectId) {
    const review = await this.ReviewModel.findById(id);
    if (!review) {
      throw new NotFoundException('Review not found');
    }
    await this.ReviewModel.findByIdAndDelete(id);
    return { message: 'Review deleted' };
  }
}
