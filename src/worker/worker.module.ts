import { Module } from '@nestjs/common';
import { WorkerService } from './worker.service';
import { WorkerController } from './worker.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  WorkerProfile,
  WorkerProfileSchema,
} from './entities/worker-profile.entity';
import { User, UserSchema } from '../auth/schemas/user.schema';
import {
  WorkerServices,
  WorkerServicesSchema,
} from './entities/worker-services.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: WorkerProfile.name, schema: WorkerProfileSchema },
      { name: User.name, schema: UserSchema },
      { name: WorkerServices.name, schema: WorkerServicesSchema },
    ]),
  ],
  controllers: [WorkerController],
  providers: [WorkerService],
})
export class WorkerModule {}
