import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../auth/schemas/user.schema';
import { Model, Types, Schema, ObjectId } from "mongoose";
import { OrderDto } from './dto/order.dto';
import { Worker } from '../auth/schemas/worker.schema';
import { WorkerServices } from '../worker/entities/worker-services.schema';
import { Order } from './entities/order.schema';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(Worker.name) private WorkerModel: Model<Worker>,
    @InjectModel(User.name) private UserModel: Model<User>,
    @InjectModel(WorkerServices.name)
    private WorkerServicesModel: Model<WorkerServices>,
    @InjectModel(Order.name) private OrderModel: Model<Order>,
  ) {}

  async findOne(id: string) {
    const user = await this.UserModel.findOne({ _id: id });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.UserModel.findOne({ _id: id });
  }

  async createOrder(orderInfo: OrderDto) {
    const service = await this.WorkerServicesModel.findById(
      orderInfo.serviceId,
    );

    if (!service) {
      throw new NotFoundException('Service not found');
    }
    const workerId = service.workerId;
    // Check if the worker is available during the requested time slot
    const isWorkerAvailable = await this.checkWorkerAvailability(
      workerId,
      orderInfo.startDate,
      orderInfo.endDate,
    );
    if (!isWorkerAvailable) {
      throw new BadRequestException(
        'The worker is not available during the requested time slot.',
      );
    }
    console.log(workerId);
    // Retrieve worker's working hours
    const worker = await this.WorkerModel.findById(workerId);
    if (!worker) {
      throw new NotFoundException('Worker not found');
    }

    // Check if the order's execution time is within worker's working hours
    const startHour = orderInfo.startDate.getHours();
    const endHour = orderInfo.endDate.getHours();
    console.log(startHour, endHour);
    if (startHour < worker.startWork || endHour > worker.endWork) {
      throw new BadRequestException(
        "The order time is outside the worker's working hours.",
      );
    }

    // Calculate the duration in hours
    const durationInHours =
      (new Date(orderInfo.endDate).getTime() -
        new Date(orderInfo.startDate).getTime()) /
      (1000 * 60 * 60);

    // Calculate the total price
    const totalPrice = durationInHours * service.price;

    return this.OrderModel.create({
      userId: orderInfo.userId,
      workerId: workerId,
      userContact: orderInfo.userContact,
      startDate: orderInfo.startDate,
      endDate: orderInfo.endDate,
      service: service.service,
      price: totalPrice,
      description: orderInfo.description,
    });
  }

  private async checkWorkerAvailability(
    workerId: Types.ObjectId,
    startDate: Date,
    endDate: Date,
  ): Promise<boolean> {
    // Find overlapping orders for the same worker
    const overlappingOrders = await this.OrderModel.find({
      workerId,
      status: { $ne: 'Declined' },
      $or: [{ startDate: { $lt: endDate }, endDate: { $gt: startDate } }],
    });

    return overlappingOrders.length === 0;
  }

  async findOrders(id: ObjectId) {
    return this.OrderModel.find({ userId: id }).populate(
      'workerId',
      'fullName',
    );
  }
}
