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
import { Admin, AdminSchema } from './schemas/admin.schema';
import {
  ResetWorkerToken,
  ResetWorkerTokenSchema,
} from './schemas/reset-token.worker.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: RefreshToken.name, schema: RefreshTokenSchema },
      { name: ResetToken.name, schema: ResetTokenSchema },
      { name: Worker.name, schema: WorkerSchema },
      { name: ResetWorkerToken.name, schema: ResetWorkerTokenSchema },
      { name: Admin.name, schema: AdminSchema },
    ]),
  ],
  providers: [AuthService, MailService],
  controllers: [AuthController],
})
export class AuthModule {}
