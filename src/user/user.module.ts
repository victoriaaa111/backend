import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../auth/schemas/user.schema';
import { Worker, WorkerSchema } from '../auth/schemas/worker.schema';
import {
  WorkerServices,
  WorkerServicesSchema,
} from '../worker/entities/worker-services.schema';
import { Order, OrderSchema } from './entities/order.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Worker.name, schema: WorkerSchema },
      { name: WorkerServices.name, schema: WorkerServicesSchema },
      { name: Order.name, schema: OrderSchema },
    ]),
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
