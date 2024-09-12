import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Admin } from '../auth/schemas/admin.schema';
import { JwtService } from '@nestjs/jwt';
import { AdminRefreshToken } from '../auth/schemas/admin.refresh-token.dto';
import { User } from '../auth/schemas/user.schema';
import { Worker } from '../auth/schemas/worker.schema';

@Injectable()
export class AdminService {
  constructor(
    @InjectModel(Admin.name)
    private adminModel: Model<Admin>,
    @InjectModel(AdminRefreshToken.name)
    private RefreshTokenModel: Model<AdminRefreshToken>,
    @InjectModel(User.name) private UserModel: Model<User>,
    @InjectModel(Worker.name) private WorkerModel: Model<Worker>,
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
}
