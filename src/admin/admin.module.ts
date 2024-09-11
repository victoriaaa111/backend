import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { MongooseModule } from '@nestjs/mongoose';
import { AdminSchema } from '../auth/schemas/admin.schema';
import {
  AdminRefreshToken,
  AdminRefreshTokenSchema,
} from '../auth/schemas/admin.refresh-token.dto';
import { User, UserSchema } from '../auth/schemas/user.schema';
import { Worker, WorkerSchema } from '../auth/schemas/worker.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Admin', schema: AdminSchema },
      { name: AdminRefreshToken.name, schema: AdminRefreshTokenSchema },
      { name: User.name, schema: UserSchema },
      { name: Worker.name, schema: WorkerSchema },
    ]),
  ],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
