import { Exclude, Expose, Transform, Type } from 'class-transformer';
import mongoose from 'mongoose';

export class ServiceDto {
  @Expose()
  @Transform(({ obj }) => obj._id.toString(), { toClassOnly: true })
  _id: string;

  @Expose()
  service: string;

  @Expose()
  description: string;

  @Expose()
  price: number;

  @Exclude()
  workerId: mongoose.Types.ObjectId;

  @Exclude()
  createdAt: Date;

  @Exclude()
  updatedAt: Date;
}

export class WorkerDto {
  @Expose()
  @Transform(({ obj }) => obj._id.toString(), { toClassOnly: true })
  _id: string;

  @Expose()
  fullName: string;

  @Expose()
  uniqueId: string;

  @Expose()
  email: string;

  @Expose()
  contact: number;

  @Expose()
  rating: number;

  @Expose()
  @Type(() => ServiceDto)
  services: ServiceDto[];

  @Expose()
  startWork: number;

  @Expose()
  endWork: number;

  @Exclude()
  createdAt: Date;

  @Exclude()
  updatedAt: Date;
}
