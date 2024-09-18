import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Worker } from '../auth/schemas/worker.schema';
import { Model } from 'mongoose';
import { User } from '../auth/schemas/user.schema';
import { WorkerServices } from '../worker/entities/worker-services.schema';
import { Order } from '../user/entities/order.schema';
import { SearchWorkerDto } from './dto/search-worker.dto';

@Injectable()
export class ShareableService {
  constructor(
    @InjectModel(Worker.name) private WorkerModel: Model<Worker>,
    @InjectModel(User.name) private UserModel: Model<User>,
    @InjectModel(WorkerServices.name)
    private WorkerServicesModel: Model<WorkerServices>,
    @InjectModel(Order.name) private OrderModel: Model<Order>,
  ) {}
  async searchWorkers(searchDto: SearchWorkerDto) {
    const { service, rating, sortOrder = 'exact' } = searchDto;
    const query: any = {};

    // if (location) {
    //   query.location = location;
    // }

    if (rating !== undefined && sortOrder === 'exact') {
      query.rating = rating; // Find workers with the exact rating
    } else if (rating !== undefined && sortOrder !== 'exact') {
      query.rating = { $gte: rating }; // Find workers with rating greater than or equal to the specified value for sorting
    }

    if (service) {
      const workers = await this.WorkerModel.find(query)
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
              : {},
        )
        .exec();

      // Filter out workers who have no associated services or where no service matches
      const filteredWorkers = workers.filter(
        (worker) => worker.services && worker.services.length > 0,
      );

      // Handle no workers found after filtering
      if (filteredWorkers.length === 0) {
        throw new NotFoundException(
          'No workers found matching the search criteria.',
        );
      }

      return filteredWorkers;
    }

    // Find workers and populate services
    const workers = await this.WorkerModel.find(query)
      .populate({
        path: 'services', // Assuming 'services' is the reference field in WorkerModel
        select: 'service description price', // The fields to include from WorkerService
      })
      .sort(
        sortOrder === 'highToLow'
          ? { rating: -1 } // Sort by rating descending
          : sortOrder === 'lowToHigh'
            ? { rating: +1 } // Sort by rating ascending
            : {},
      )
      .exec();

    return workers;
  }
}
