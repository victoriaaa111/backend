import { Exclude, Expose, Type } from 'class-transformer';
import mongoose from 'mongoose';

export class ServiceDto {
  @Expose()
  service: string;

  @Expose()
  serviceDescription: string;

  @Expose()
  price: number;

  @Expose()
  _id: mongoose.Types.ObjectId;

  @Exclude()
  userId: mongoose.Types.ObjectId;

  @Exclude()
  createdAt: Date;

  @Exclude()
  updatedAt: Date;
}

export class WorkerDto {
  @Expose()
  username: string;

  @Expose()
  email: string;

  @Expose()
  contact: number;

  @Expose()
  rating: number;

  @Expose()
  @Type(() => ServiceDto)
  services: ServiceDto[];

  @Exclude()
  _id: mongoose.Types.ObjectId;

  @Exclude()
  userId: mongoose.Types.ObjectId;

  @Exclude()
  createdAt: Date;

  @Exclude()
  updatedAt: Date;
}
