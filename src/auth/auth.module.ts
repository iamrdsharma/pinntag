import { Logger, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
// import { GoogleStrategy } from './strategies/google.strategy';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './strategies/local.strategy';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/user/models/user.model';
import { Role, RoleSchema } from 'src/models/role.model';
import { Otp, OtpSchema } from './models/otp.model';
import { MailModule } from 'src/mail/mail.module';
import { MailService } from 'src/mail/mail.service';
import { UserService } from 'src/user/user.service';
import { Token, TokenSchema } from './models/token.model';
import {
  BusinessProfile,
  BusinessProfileSchema,
} from 'src/user/models/businessProfile.model';
import { Following, FollowingSchema } from 'src/user/models/following.model';

@Module({
  imports: [
    // MailModule,
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Role.name, schema: RoleSchema },
      { name: Otp.name, schema: OtpSchema },
      { name: Token.name, schema: TokenSchema },
      { name: BusinessProfile.name, schema: BusinessProfileSchema },
      { name: Following.name, schema: FollowingSchema },
    ]),
    PassportModule.register({ session: false }),
    JwtModule.register({
      secret: process.env.SESSION_SECRET,
      signOptions: { expiresIn: '7d' },
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtService,
    LocalStrategy,
    Logger,
    MailService,
    UserService,
    // GoogleStrategy
  ],
})
export class AuthModule {}
