import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../auth/schemas/user.schema';
import { Model, Types, ObjectId } from 'mongoose';
import { OrderDto } from './dto/order.dto';
import { Worker } from '../auth/schemas/worker.schema';
import { WorkerServices } from '../worker/entities/worker-services.schema';
import { Order } from './entities/order.schema';
import { TimeDto } from './dto/time.dto';
import { IdDto } from './dto/userId.dto';
import { ReviewDto } from './dto/review.dto';
import { Review } from './entities/review.schema';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(Worker.name) private WorkerModel: Model<Worker>,
    @InjectModel(User.name) private UserModel: Model<User>,
    @InjectModel(WorkerServices.name)
    private WorkerServicesModel: Model<WorkerServices>,
    @InjectModel(Order.name) private OrderModel: Model<Order>,
    @InjectModel(Review.name) private ReviewModel: Model<Review>,
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
    // Retrieve worker's working hours
    const worker = await this.WorkerModel.findById(workerId);
    if (!worker) {
      throw new NotFoundException('Worker not found');
    }

    // Check if the order's execution time is within worker's working hours
    const startHour = orderInfo.startDate.getHours();
    const endHour = orderInfo.endDate.getHours();
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
      status: { $nin: ['Declined', 'Canceled'] },
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

  async cancelOrder(id: ObjectId, userId: IdDto) {
    const order = await this.OrderModel.findById(id);
    if (!order) {
      throw new NotFoundException('Order not found');
    }

    if (order.userId.toString() !== userId.userId) {
      throw new BadRequestException('The order dose not belong to this user');
    }
    if (order.status !== 'Pending') {
      throw new BadRequestException('The user can not change the status');
    }
    await this.OrderModel.findByIdAndUpdate(id, {
      status: 'Canceled',
    });
    return { message: 'The order has been cancelled' };
  }

  async findWorkerAvailability(id: ObjectId, date: TimeDto) {
    const worker = await this.WorkerModel.findById(id);
    if (!worker) {
      throw new NotFoundException('Worker not found');
    }
    // Get start and end of the day based on worker's working hours
    const startOfDay = new Date(date.date);
    startOfDay.setHours(worker.startWork + 3, 0, 0, 0);
    const endOfDay = new Date(date.date);
    endOfDay.setHours(worker.endWork + 3, 0, 0, 0);

    // Retrieve all orders for the worker on the specified day
    const orders = await this.OrderModel.find({
      workerId: id,
      startDate: { $gte: startOfDay },
      endDate: { $lte: endOfDay },
      status: { $nin: ['Declined', 'Canceled'] },
    }).sort('startDate');

    // Calculate free hours between orders
    const freeHours = [];
    let lastEnd = startOfDay;

    for (const order of orders) {
      if (order.startDate > lastEnd) {
        freeHours.push({ start: lastEnd, end: order.startDate });
      }
      lastEnd = order.endDate;
    }

    // Add remaining time after the last order
    if (lastEnd < endOfDay) {
      freeHours.push({ start: lastEnd, end: endOfDay });
    }

    return freeHours;
  }

  async addReview(reviewInfo: ReviewDto) {
    const order = await this.OrderModel.findById(reviewInfo.orderId);
    if (!order) {
      throw new NotFoundException('Order not found');
    }

    if (reviewInfo.userId !== order.userId.toString()) {
      throw new BadRequestException('This order dose not belong to this user');
    }

    const reviewInUse = await this.ReviewModel.findOne({
      userId: reviewInfo.userId,
      orderId: reviewInfo.orderId,
    });
    if (order.status !== 'Done') {
      throw new BadRequestException(
        'You can not leave a review if the order have not been done',
      );
    }

    if (reviewInUse) {
      throw new BadRequestException(
        'The user has created an review for this order',
      );
    }

    const date = new Date();

    await this.ReviewModel.create({
      userId: reviewInfo.userId,
      workerId: order.workerId,
      orderId: reviewInfo.orderId,
      rating: reviewInfo.rating,
      comment: reviewInfo.comment,
      date: date,
    });
  }
}
