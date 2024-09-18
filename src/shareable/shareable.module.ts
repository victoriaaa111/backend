import { Module } from '@nestjs/common';
import { ShareableService } from './shareable.service';
import { ShareableController } from './shareable.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Worker, WorkerSchema } from '../auth/schemas/worker.schema';
import { User, UserSchema } from '../auth/schemas/user.schema';
import {
  WorkerServices,
  WorkerServicesSchema,
} from '../worker/entities/worker-services.schema';
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
  controllers: [ShareableController],
  providers: [ShareableService],
})
export class ShareableModule {}
