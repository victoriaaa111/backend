import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { MongooseModule } from '@nestjs/mongoose';
import { AdminSchema } from '../auth/schemas/admin.schema';
import { User, UserSchema } from '../auth/schemas/user.schema';
import { Worker, WorkerSchema } from '../auth/schemas/worker.schema';
import { Review, ReviewSchema } from '../user/entities/review.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Admin', schema: AdminSchema },
      { name: User.name, schema: UserSchema },
      { name: Worker.name, schema: WorkerSchema },
      { name: Review.name, schema: ReviewSchema },
    ]),
  ],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
