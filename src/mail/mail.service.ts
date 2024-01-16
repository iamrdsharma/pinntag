import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Otp, OtpDocument } from 'src/auth/models/otp.model';
import { OtpTypes } from 'src/enums/auth.enums';
import { generateOtp } from 'src/helpers/auth.helpers';
import { User, UserDocument } from 'src/user/models/user.model';
import { UserService } from 'src/user/user.service';

@Injectable()
export class MailService {
  constructor(
    @InjectModel(Otp.name) private readonly otpModel: Model<OtpDocument>,
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    private readonly mailerService: MailerService,
    private readonly userService: UserService,
  ) {}

  async sendUserVerificationMail(userId: string) {
    const user = await this.userService.getUserById(userId);
    const otp = await this.userService.saveOtp({
      user: userId,
      type: OtpTypes.EMAIL,
    });
    await this.mailerService.sendMail({
      to: user.email,
      subject: 'Verify your email',
      template: './mailVerification.template.hbs',
      context: {
        name: user.firstName,
        otp,
        otpExpiry: '5 minutes',
      },
    });
  }

  async sendForgotPasswordMail(userId: string) {
    const user = await this.userService.getUserById(userId);
    const otp = await this.userService.saveOtp({
      user: userId,
      type: OtpTypes.EMAIL,
    });
    await this.mailerService.sendMail({
      to: user.email,
      subject: 'Reset your account password',
      template: './forgotPassword.template.hbs',
      context: {
        name: user.firstName,
        otp,
        otpExpiry: '5 minutes',
      },
    });
  }
}
