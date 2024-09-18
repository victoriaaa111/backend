import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model, ObjectId } from 'mongoose';
import { User } from '../auth/schemas/user.schema';
import { WorkerServices } from './entities/worker-services.schema';
import { Worker } from '../auth/schemas/worker.schema';
import { UpdateWorkerDto } from './dto/update-worker.dto';
import { Order } from '../user/entities/order.schema';
import { OrderStatusDto } from './dto/order.status.dto';
import { ServiceDto } from './dto/service.dto';
import { SearchWorkerDto } from "./dto/search-worker.dto";
import * as path from "node:path";

@Injectable()
export class WorkerService {
  constructor(
    @InjectModel(Worker.name) private WorkerModel: Model<Worker>,
    @InjectModel(User.name) private UserModel: Model<User>,
    @InjectModel(WorkerServices.name)
    private WorkerServicesModel: Model<WorkerServices>,
    @InjectModel(Order.name) private OrderModel: Model<Order>,
  ) {}

  async addService(workerId: mongoose.Types.ObjectId, serviceData: ServiceDto) {
    try {
      const worker = await this.WorkerModel.findOne({_id: workerId});
      if (!worker) {
        throw new NotFoundException('Worker not found');
      }

      if (serviceData.id === null) {
        const newService = new this.WorkerServicesModel({
          workerId: worker._id,
          ...serviceData,
        });
        const savedService = await newService.save();

        const id = worker._id;
        await this.WorkerModel.findByIdAndUpdate(
            id,
            {$push: {services: savedService._id}},
            {new: true, useFindAndModify: false},
        );
        return {message: 'Service Created'};
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
    const service = await this.WorkerServicesModel.findById(serviceId);
    if (!service) {
      throw new NotFoundException('Service not found');
    }
    if (worker._id.toString() !== service.workerId.toString()) {
      throw new BadRequestException(
        'The service dose not belong to this worker',
      );
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
    // return this.WorkerModel.findById(workerId);
    return this.WorkerModel.findById(workerId).populate({
      path: 'services',
      select: 'id service description price',
    });
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

  async findOrders(id: ObjectId) {
    return this.OrderModel.find({ workerId: id });
  }

  async executedStatusChange(id: ObjectId, orderStatus: OrderStatusDto) {
    const order = await this.OrderModel.findById(id);
    if (!order) {
      throw new NotFoundException('Order not found');
    }
    if (order.status === 'Pending') {
      if (
        orderStatus.status === 'In Progress' ||
        orderStatus.status === 'Declined'
      ) {
        await this.OrderModel.findOneAndUpdate(
          { _id: id },
          { status: orderStatus.status },
        );
        return { message: 'Status has been changed' };
      } else
        throw new BadRequestException(
          'Status transitions should follow logical steps, such as: "Pending" → "In Progress", "In Progress" → "Done"',
        );
    }

    if (order.status === 'In Progress') {
      if (orderStatus.status === 'Done') {
        await this.OrderModel.findOneAndUpdate(
          { _id: id },
          { status: orderStatus.status },
        );
        return { message: 'Status has been changed' };
      } else
        throw new BadRequestException(
          'Status transitions should follow logical steps, such as: "Pending" → "In Progress", "In Progress" → "Done"',
        );
    }

    if (order.status === 'Declined') {
      throw new BadRequestException(
        'Status can not be changed the order was declined',
      );
    }

    if (order.status === 'Done') {
      throw new BadRequestException(
        'Status can not be changed the order was Done',
      );
    }
  }

  async searchWorkers(searchDto: SearchWorkerDto) {
    const { service, rating, page, limit, sortOrder='exact' } = searchDto;
    const query: any = {};

    // if (location) {
    //   query.location = location;
    // }

    if (rating !== undefined && sortOrder === 'exact') {
      query.rating = rating; // Find workers with the exact rating
    } else if (rating !== undefined && sortOrder !== 'exact') {
      query.rating = { $gte: rating }; // Find workers with rating greater than or equal to the specified value for sorting
    }

    if(service){
      console.log(service);
      const workers = await this.WorkerModel
          .find(query)
          .populate({
            path: 'services', // Assuming 'services' is the reference field in WorkerModel
            select: 'service description price', // The fields to include from WorkerService
            match: service ? { service: { $regex: service, $options: 'i' } } : {}, // Match the service name using regex
          })
          // .sort({ rating: -1 }) // Sort workers by rating in descending order
          .sort(
              sortOrder === 'highToLow'
                  ? { rating: -1 } // Sort by rating descending
                  : sortOrder === 'lowToHigh'
                      ? { rating: +1 } // Sort by rating ascending
                      : {}
          )
          .skip((page - 1) * limit) // Apply pagination
          .limit(limit)
          .exec();

      // Filter out workers who have no associated services or where no service matches
      const filteredWorkers = workers.filter(worker => worker.services && worker.services.length > 0);
      console.log('Workers after sorting:', filteredWorkers);

      // Handle no workers found after filtering
      if (filteredWorkers.length === 0) {
        throw new NotFoundException('No workers found matching the search criteria.');
      }

      return filteredWorkers;
    }

    // Find workers and populate services
    const workers = await this.WorkerModel
        .find(query)
        .populate({
          path: 'services', // Assuming 'services' is the reference field in WorkerModel
          select: 'service description price', // The fields to include from WorkerService
        })
        .sort(
            sortOrder === 'highToLow'
                ? { rating: -1 } // Sort by rating descending
                : sortOrder === 'lowToHigh'
                    ? { rating: +1 } // Sort by rating ascending
                    : {}
        )
        .skip((page - 1) * limit) // Apply pagination
        .limit(limit)
        .exec();

    return workers;
  }
}
