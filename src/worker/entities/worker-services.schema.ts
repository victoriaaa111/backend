import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

@Schema({ versionKey: false, timestamps: true })
export class WorkerServices extends Document {
  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'WorkerProfile',
  })
  userId: mongoose.Types.ObjectId;

  @Prop()
  service: string;

  @Prop()
  price: number;
}

export const WorkerServicesSchema =
  SchemaFactory.createForClass(WorkerServices);
