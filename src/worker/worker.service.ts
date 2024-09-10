import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateWorkerDto } from './dto/create-worker.dto';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { WorkerProfile } from './entities/worker-profile.entity';
import { User } from '../auth/schemas/user.schema';
import { WorkerServices } from './entities/worker-services.schema';

@Injectable()
export class WorkerService {
  constructor(
    @InjectModel(WorkerProfile.name) private WorkerModel: Model<WorkerProfile>,
    @InjectModel(User.name) private UserModel: Model<User>,
    @InjectModel(WorkerServices.name)
    private WorkerServicesModel: Model<WorkerServices>,
  ) {}

  async create(workerDetails: CreateWorkerDto) {
    const { userId, contact, rating, services } = workerDetails;
    const workerInUse = await this.WorkerModel.findOne({ userId });
    if (workerInUse) {
      throw new BadRequestException('Invalid worker in use');
    }
    const userInUse = await this.UserModel.findOne({ _id: userId });
    if (!userInUse) {
      throw new BadRequestException("User doesn't exist");
    }
    const { name, email } = userInUse;

    // Create worker profile
    const worker = await this.WorkerModel.create({
      userId,
      name,
      email,
      contact,
      rating,
    });

    // Create services
    const createdServices = await this.WorkerServicesModel.insertMany(
      services.map((serviceData) => ({
        userId: userId,
        ...serviceData,
      })),
    );

    // Link services to worker profile
    worker.services = createdServices.map(
      (service) => service._id,
    ) as mongoose.Types.ObjectId[];
    await worker.save();

    return worker;
  }

  async addService(
    userId: mongoose.Types.ObjectId,
    serviceData: { service: string; price: number },
  ) {
    const worker = await this.WorkerModel.findOne({ userId: userId });
    if (!worker) {
      throw new NotFoundException('Worker not found');
    }
    const newService = new this.WorkerServicesModel({
      userId: userId,
      ...serviceData,
    });

    const savedService = await newService.save();

    const id = worker._id;

    return this.WorkerModel.findByIdAndUpdate(
      id,
      { $push: { services: savedService._id } },
      { new: true, useFindAndModify: false },
    );
  }

  async deleteServiceFromWorker(userId: string, service: string) {
    const worker = await this.WorkerModel.findOne({ userId: userId });
    if (!worker) {
      throw new NotFoundException('Worker not found');
    }

    const workerService = await this.WorkerServicesModel.findOne({
      userId: userId,
      service: service,
    });
    if (!workerService) {
      throw new NotFoundException('Service not found');
    }

    // Remove the service from the worker's services array
    await this.WorkerModel.updateOne(
      { _id: worker._id },
      { $pull: { services: workerService._id } },
    );

    await this.WorkerServicesModel.findOneAndDelete({
      userId: userId,
      service: service,
    });

    return worker;
  }

  async findOne(userId: string) {
    const worker = await this.WorkerModel.findOne({ userId });
    if (!worker) {
      throw new NotFoundException('Worker not found');
    }
    return this.WorkerModel.findOne({ userId }).populate('services').exec();
  }
}
