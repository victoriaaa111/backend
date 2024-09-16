import { Module } from '@nestjs/common';
import { WorkerService } from './worker.service';
import { WorkerController } from './worker.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../auth/schemas/user.schema';
import {
  WorkerServices,
  WorkerServicesSchema,
} from './entities/worker-services.schema';
import { Worker, WorkerSchema } from '../auth/schemas/worker.schema';
import { Order, OrderSchema } from '../user/entities/order.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Worker.name, schema: WorkerSchema },
      { name: User.name, schema: UserSchema },
      { name: WorkerServices.name, schema: WorkerServicesSchema },
      { name: Order.name, schema: OrderSchema },
    ]),
  ],
  controllers: [WorkerController],
  providers: [WorkerService],
})
export class WorkerModule {}
