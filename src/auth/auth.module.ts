import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user.schema';
import {
  RefreshToken,
  RefreshTokenSchema,
} from './schemas/refresh-token.schema';
import { ResetToken, ResetTokenSchema } from './schemas/reset-token.schema';
import { MailService } from 'src/services/mail.service';
import { Worker, WorkerSchema } from './schemas/worker.schema';
import {
  RefreshTokenWorker,
  RefreshTokenWorkerSchema,
} from './schemas/refresh-token.admin.schema';
import { AdminSchema } from './schemas/admin.schema';
import {
  AdminRefreshToken,
  AdminRefreshTokenSchema,
} from './schemas/admin.refresh-token.dto';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: RefreshToken.name, schema: RefreshTokenSchema },
      { name: ResetToken.name, schema: ResetTokenSchema },
      { name: Worker.name, schema: WorkerSchema },
      { name: RefreshTokenWorker.name, schema: RefreshTokenWorkerSchema },
      { name: 'Admin', schema: AdminSchema },
      { name: AdminRefreshToken.name, schema: AdminRefreshTokenSchema },
    ]),
  ],
  providers: [AuthService, MailService],
  controllers: [AuthController],
})
export class AuthModule {}
