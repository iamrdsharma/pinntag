import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { TokenTypes } from 'src/enums/auth.enums';
import { User } from 'src/user/models/user.model';

export type TokenDocument = Token & mongoose.Document;
@Schema({ timestamps: true })
export class Token {
  @Prop()
  token: string;
  @Prop({ required: true, ref: User.name })
  userId: mongoose.Schema.Types.ObjectId;
  @Prop({
    enum: [
      TokenTypes.ACCESS,
      TokenTypes.REFRESH,
      TokenTypes.RESET_PASSWORD,
      TokenTypes.VERIFY_EMAIL,
      TokenTypes.EMAIL_OTP,
      TokenTypes.MOBILE_OTP,
    ],
    required: true,
  })
  type: string;
  @Prop()
  expiresAt: Date;
  @Prop({ default: false })
  isBlacklisted: boolean;
}

export const TokenSchema = SchemaFactory.createForClass(Token);

TokenSchema.index({ createdAt: 1 }, { expireAfterSeconds: 86400 });
