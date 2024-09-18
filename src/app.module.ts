/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { AdminModule } from './admin/admin.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { WorkerModule } from './worker/worker.module';
import { UserModule } from './user/user.module';
import * as process from "node:process";
import { ScheduleModule } from "@nestjs/schedule";
import { TaskService } from './task/task.service';
import { User, UserSchema } from "./auth/schemas/user.schema";
import { Worker, WorkerSchema } from "./auth/schemas/worker.schema";
import { WorkerServices, WorkerServicesSchema } from "./worker/entities/worker-services.schema";
import { Order, OrderSchema } from "./user/entities/order.schema";
import { Review, ReviewSchema } from "./user/entities/review.schema";
import { ShareableModule } from './shareable/shareable.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    JwtModule.register({global: true, secret: process.env.JWT_SECRET}),
    MongooseModule.forRoot(process.env.DATABASE_URL),
    AdminModule,
    AuthModule,
    WorkerModule,
    UserModule,
    ScheduleModule.forRoot(),
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Worker.name, schema: WorkerSchema },
      { name: WorkerServices.name, schema: WorkerServicesSchema },
      { name: Order.name, schema: OrderSchema },
      { name: Review.name, schema: ReviewSchema },
    ]),
    ShareableModule,
  ],
  controllers: [AppController],
  providers: [AppService, TaskService],
})
export class AppModule {}
