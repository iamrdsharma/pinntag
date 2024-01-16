import { Global, Logger, Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { join } from 'path';
import { MongooseModule } from '@nestjs/mongoose';
import { Otp, OtpSchema } from 'src/auth/models/otp.model';
import { UserService } from 'src/user/user.service';
import { AuthService } from 'src/auth/auth.service';
import { User, UserSchema } from 'src/user/models/user.model';
import { Role, RoleSchema } from 'src/models/role.model';
import { JwtService } from '@nestjs/jwt';
import { Token, TokenSchema } from 'src/auth/models/token.model';
import {
  BusinessProfile,
  BusinessProfileSchema,
} from 'src/user/models/businessProfile.model';
import { Following, FollowingSchema } from 'src/user/models/following.model';

@Global()
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Otp.name, schema: OtpSchema },
      { name: User.name, schema: UserSchema },
      { name: Token.name, schema: TokenSchema },
      { name: Role.name, schema: RoleSchema },
      { name: BusinessProfile.name, schema: BusinessProfileSchema },
      { name: Following.name, schema: FollowingSchema },
    ]),
    MailerModule.forRoot({
      transport: {
        host: 'smtp.gmail.com',
        port: 587,
        auth: {
          user: 'tns.flutter1@gmail.com',
          pass: 'yexu pyto ujrl tuks',
        },
      },
      defaults: {
        from: '"No Reply" <noreply@example.com>',
      },
      template: {
        dir: join(__dirname + '/templates'),
        adapter: new HandlebarsAdapter(),
        options: {
          strict: true,
        },
      },
    }),
  ],
  providers: [MailService, UserService, AuthService, JwtService, Logger],
})
export class MailModule {}
