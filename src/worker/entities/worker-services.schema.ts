import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

@Schema({ versionKey: false, timestamps: true })
export class WorkerServices extends Document {
  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Worker',
  })
  workerId: mongoose.Types.ObjectId;

  @Prop()
  service: string;

  @Prop()
  description: string;

  @Prop()
  price: number;
}

export const WorkerServicesSchema =
  SchemaFactory.createForClass(WorkerServices);
