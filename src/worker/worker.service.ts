import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { User } from '../auth/schemas/user.schema';
import { WorkerServices } from './entities/worker-services.schema';
import { Worker } from '../auth/schemas/worker.schema';
import { UpdateWorkerDto } from './dto/update-worker.dto';

@Injectable()
export class WorkerService {
  constructor(
    @InjectModel(Worker.name) private WorkerModel: Model<Worker>,
    @InjectModel(User.name) private UserModel: Model<User>,
    @InjectModel(WorkerServices.name)
    private WorkerServicesModel: Model<WorkerServices>,
  ) {}

  async addService(
    workerId: mongoose.Types.ObjectId,
    serviceData: {
      id?: string;
      service: string;
      description: string;
      price: number;
    },
  ) {
    try {
      const worker = await this.WorkerModel.findOne({ _id: workerId });
      if (!worker) {
        throw new NotFoundException('Worker not found');
      }

      if (serviceData.id === null) {
        const newService = new this.WorkerServicesModel({
          workerId: workerId,
          ...serviceData,
        });
        const savedService = await newService.save();

        const id = worker._id;
        await this.WorkerModel.findByIdAndUpdate(
          id,
          { $push: { services: savedService._id } },
          { new: true, useFindAndModify: false },
        );
        return { message: 'Service Created' };
      }

      const service = await this.WorkerServicesModel.findById(serviceData.id);
      if (!service) {
        throw new NotFoundException('Service not found');
      }
      await this.WorkerServicesModel.findByIdAndUpdate(serviceData.id, {
        service: serviceData.service,
        description: serviceData.description,
        price: serviceData.price,
      });
      return { message: 'Service Updated' };
    } catch (error) {
      return { message: error.message };
    }
  }

  async deleteServiceFromWorker(workerId: string, serviceId: string) {
    const worker = await this.WorkerModel.findOne({ _id: workerId });
    if (!worker) {
      throw new NotFoundException('Worker not found');
    }

    const workerService = await this.WorkerServicesModel.findById({
      _id: serviceId,
    });
    if (!workerService) {
      throw new NotFoundException('Service not found');
    }

    // Remove the service from the worker's services array
    await this.WorkerModel.updateOne(
      { _id: worker._id },
      { $pull: { services: workerService._id } },
    );

    await this.WorkerServicesModel.findByIdAndDelete({
      _id: serviceId,
    });

    return worker;
  }

  async findOne(workerId: string) {
    const worker = await this.WorkerModel.findOne({ _id: workerId });
    if (!worker) {
      throw new NotFoundException('Worker not found');
    }

    return this.WorkerModel.findOne({ _id: workerId })
      .populate({
        path: 'services',
        select: 'service description price',
      })
      .exec();
  }

  async editOne(workerId: string, updateWorker: UpdateWorkerDto) {
    const worker = await this.WorkerModel.findById(workerId);
    if (!worker) {
      throw new NotFoundException('Worker not found');
    }
    return this.WorkerModel.findByIdAndUpdate(workerId, updateWorker, {
      new: true,
      useFindAndModify: false,
    });
  }
}
