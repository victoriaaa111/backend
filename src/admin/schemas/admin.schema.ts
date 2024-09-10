import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Admin extends Document {
  @Prop({ required: true })
  email: string;

  @Prop({ required: true, unique: true })
  password: string;
}

export const AdminSchema = SchemaFactory.createForClass(Admin);
