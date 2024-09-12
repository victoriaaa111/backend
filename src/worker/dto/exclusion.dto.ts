import { Exclude, Expose, Transform, Type } from "class-transformer";
import mongoose from 'mongoose';

export class ServiceDto {
  @Expose()
  _id: string;

  @Expose()
  service: string;

  @Expose()
  description: string;

  @Expose()
  price: number;

  @Exclude()
  workerId: string;

  @Exclude()
  createdAt: Date;

  @Exclude()
  updatedAt: Date;
}

export class WorkerDto {
  @Expose()
  @Transform(({ value }) => value.toString())
  _id: string;

  @Expose()
  fullName: string;

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
  createdAt: Date;

  @Exclude()
  updatedAt: Date;
}
