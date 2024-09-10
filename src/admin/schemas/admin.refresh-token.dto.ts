import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

@Schema({ versionKey: false, timestamps: true })
export class AdminRefreshToken extends Document {
  @Prop({ required: true })
  token: string;
  @Prop({ required: true, type: mongoose.Types.ObjectId })
  adminId: mongoose.Types.ObjectId;
  @Prop({ required: true })
  expiryDate: Date;
}

export const AdminRefreshTokenSchema =
  SchemaFactory.createForClass(AdminRefreshToken);
