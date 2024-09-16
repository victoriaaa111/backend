import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

@Schema()
export class Order extends Document {
  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  })
  userId: mongoose.Types.ObjectId;

  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Worker',
  })
  workerId: mongoose.Types.ObjectId;

  @Prop({
    required: true,
    enum: ['Pending', 'Declined', 'In Progress', 'Done'],
    default: 'Pending',
  })
  status: string;

  @Prop({ required: true })
  userContact: number;

  @Prop({ required: true })
  startDate: Date;

  @Prop({ required: true })
  endDate: Date;

  @Prop({ required: true })
  service: string;

  @Prop({ required: true })
  price: number;

  @Prop({ required: true })
  description: string;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
