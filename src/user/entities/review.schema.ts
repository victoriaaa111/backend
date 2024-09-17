import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

@Schema()
export class Review extends Document {
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
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
  })
  orderId: mongoose.Types.ObjectId;

  @Prop({ required: true })
  rating: number;

  @Prop()
  comment: string;

  @Prop({ required: true })
  date: Date;
}

export const ReviewSchema = SchemaFactory.createForClass(Review);
