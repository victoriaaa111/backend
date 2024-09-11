import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

@Schema({ versionKey: false, timestamps: true })
export class Worker extends Document {
  @Prop({ required: true })
  fullName: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true, unique: true })
  username: string;

  @Prop({ required: true })
  contact: number;

  @Prop()
  rating: number;

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'WorkerServices' }],
  })
  services: mongoose.Types.ObjectId[];

  @Prop({ required: true })
  password: string;

  @Prop()
  isActive: boolean;
}

export const WorkerSchema = SchemaFactory.createForClass(Worker);
