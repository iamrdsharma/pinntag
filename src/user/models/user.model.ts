import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Genders } from 'src/enums/user.enum';
import * as bcrypt from 'bcrypt';
import { Role } from 'src/models/role.model';
import { BusinessProfile } from './businessProfile.model';

export type UserDocument = User & Document;
@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, ref: Role.name })
  role: mongoose.Schema.Types.ObjectId;
  @Prop({ required: true })
  firstName: string;
  @Prop()
  lastName: string;
  @Prop()
  profilePhoto: string;
  @Prop({ unique: true, required: true })
  email: string;
  @Prop({ default: false })
  isEmailVerified: boolean;
  @Prop()
  countryCode: string;
  @Prop()
  phone: string;
  @Prop({ default: false })
  isPhoneVerified: boolean;
  @Prop({ default: null })
  password: string;
  @Prop()
  latitude: number;
  @Prop()
  longitude: number;
  @Prop({ default: false })
  isOAuth: boolean;
  @Prop({
    enum: [Genders.MALE, Genders.FEMALE, Genders.OTHER, Genders.RATHER_NOT_SAY],
  })
  gender: string;
  @Prop()
  age: number;
  @Prop()
  oAuthProvider: string;
  @Prop({ default: false })
  isSubscribedForBusiness: boolean;
  @Prop({ default: false })
  isBusiness: boolean;
  @Prop({ ref: BusinessProfile.name })
  businessProfile: mongoose.Schema.Types.ObjectId;
  @Prop({ ref: User.name })
  createdBy: mongoose.Schema.Types.ObjectId;
}
export const UserSchema = SchemaFactory.createForClass(User);

// Function to crypt password (if it is present) before save
UserSchema.pre<User>('save', function (next) {
  if (this.password) {
    this.password = bcrypt.hashSync(this.password, 10);
  }
  next();
});
