import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { User } from './user.model';
import mongoose from 'mongoose';

export type FollowingDocument = Following & mongoose.Document;
@Schema({ timestamps: true })
export class Following {
  @Prop({ required: true, ref: User.name })
  user: mongoose.Types.ObjectId;
  @Prop({ required: true, ref: User.name })
  businessProfile: mongoose.Types.ObjectId;
  @Prop({ required: true, default: false })
  status: number;
}

export const FollowingSchema = SchemaFactory.createForClass(Following);
