import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

@Schema({ versionKey: false, timestamps: true })
export class RefreshTokenWorker extends Document {
  @Prop({ required: true })
  token: string;
  @Prop({ required: true, type: mongoose.Types.ObjectId })
  workerId: mongoose.Types.ObjectId;
  @Prop({ required: true })
  expiryDate: Date;
}

export const RefreshTokenWorkerSchema =
  SchemaFactory.createForClass(RefreshTokenWorker);
