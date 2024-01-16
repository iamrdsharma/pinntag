import { Logger, Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './models/user.model';
import { Role, RoleSchema } from 'src/models/role.model';
import { Otp, OtpSchema } from 'src/auth/models/otp.model';
import { Token, TokenSchema } from 'src/auth/models/token.model';
import {
  BusinessProfile,
  BusinessProfileSchema,
} from './models/businessProfile.model';
import { JwtService } from '@nestjs/jwt';
import { Following, FollowingSchema } from './models/following.model';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Role.name, schema: RoleSchema },
      { name: Otp.name, schema: OtpSchema },
      { name: Token.name, schema: TokenSchema },
      { name: BusinessProfile.name, schema: BusinessProfileSchema },
      { name: Following.name, schema: FollowingSchema },
    ]),
  ],
  controllers: [UserController],
  providers: [UserService, JwtService, Logger],
})
export class UserModule {}
