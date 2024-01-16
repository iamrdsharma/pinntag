import { Injectable, Logger } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { User, UserDocument } from 'src/user/models/user.model';
import mongoose, { Model } from 'mongoose';
import { Role, RoleDocument } from 'src/models/role.model';
import { Roles } from 'src/enums/user.enum';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { MailService } from 'src/mail/mail.service';
import { VerifyOtpDto } from './dto/verifyOtp.dto';
import { UserService } from 'src/user/user.service';
import { OtpTypes } from 'src/enums/auth.enums';
import { ResendOtpDto } from './dto/resendOtp.dto';
import { ResetPaswordDto } from './dto/resetPass.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    @InjectModel(Role.name) private readonly roleModel: Model<RoleDocument>,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
    private readonly logger: Logger,
  ) {}

  async googleLogin(req: any) {
    if (!req.user) {
      return {
        success: false,
        message: 'No user from google',
      };
    } else {
      const userFound = await this.userModel
        .findOne({ email: req.user.email })
        .exec();
      if (!userFound) {
        const user = await this.userModel.create({
          firstName: req.user.firstName,
          lastName: req.user.lastName,
          profilePhoto: req.user.picture,
          email: req.user.email,
          isOAuth: true,
          oAuthProvider: 'google',
        });
        return {
          success: true,
          message: 'User information from google',
          user: req.user,
        };
      }
    }
  }

  async continueWithFacebook(body: any) {
    const userFound = await this.userModel
      .findOne({ email: body.email })
      .exec();
    if (!userFound) {
      const user = await this.userModel.create({
        firstName: body.firstName,
        lastName: body.lastName,
        profilePhoto: body.picture,
        email: body.email,
        isOAuth: true,
        oAuthProvider: 'facebook',
      });
      return {
        success: true,
        message: 'User information from facebook',
        user: user,
      };
    }
  }

  async forgotPassword(email: string) {
    const user = await this.userModel.findOne({ email }).exec();
    if (!user) {
      return {
        success: false,
        message: 'User not found with the email provided.',
      };
    } else {
      await this.mailService.sendForgotPasswordMail(user.id);
      return {
        success: true,
        id: user.id,
        message: 'Otp sent successfully',
      };
    }
  }

  async resetPassword(data: ResetPaswordDto) {
    const user = await this.userModel.findById(data.id).exec();
    if (!user) {
      return {
        success: false,
        message: 'User not found with the id provided.',
      };
    } else {
      const otpResult = await this.userService.validateOtp({
        user: user.id,
        type: OtpTypes.EMAIL,
        otp: data.otp,
      });
      if (!otpResult.success) {
        return {
          success: false,
          message: otpResult.message,
        };
      } else {
        const hashedPassword = await bcrypt.hash(data.password, 10);
        await this.userModel.updateOne(
          { _id: new mongoose.Types.ObjectId(data.id) },
          { $set: { password: hashedPassword } },
        );
        return {
          success: true,
          message: 'Password reset successfully',
        };
      }
    }
  }

  async create(createAuthDto: CreateAuthDto) {
    const foundUser = await this.userModel
      .findOne({ email: createAuthDto.email })
      .exec();
    if (foundUser) {
      return {
        success: false,
        message: 'User already exists',
      };
    } else {
      const role = await this.roleModel.findOne({ name: Roles.USER }).exec();
      const user = await this.userModel.create({
        role: role._id,
        ...createAuthDto,
      });
      await this.mailService.sendUserVerificationMail(user.id);
      return {
        success: true,
        message: 'User created successfully',
        user,
      };
    }
  }

  async login(loginDto: LoginDto) {
    const validatedUser = await this.validateUser(
      loginDto.email,
      loginDto.password,
    );
    if (validatedUser.success) {
      const user = validatedUser.user;
      if (!user.isEmailVerified) {
        await this.mailService.sendUserVerificationMail(user.id);
        return {
          success: true,
          user: user.id,
          message:
            'Please verify your email to login, otp has been sent to the registered mail.',
        };
      }
      const token = await this.generateJWT(user._id.toString(), user.email);
      return {
        success: true,
        message: 'User logged in successfully',
        user,
        token,
      };
    } else {
      return {
        success: false,
        message: validatedUser.message,
      };
    }
  }

  async verifyOtp(data: VerifyOtpDto) {
    const user = await this.userService.getUserById(data.user);
    if (!user) {
      return {
        success: false,
        message: 'User not found with the id provided.',
      };
    } else {
      const otpResult = await this.userService.validateOtp(data);
      if (!otpResult.success) {
        return {
          success: false,
          message: otpResult.message,
        };
      } else {
        const updateObj =
          data.type == OtpTypes.EMAIL
            ? { isEmailVerified: true }
            : { isPhoneVerified: true };
        await this.userModel.updateOne(
          { _id: new mongoose.Types.ObjectId(data.user) },
          { $set: updateObj },
        );
        // const token = await this.generateJWT(data.user, user.email);
        return {
          success: true,
          message: 'Otp verified successfully',
        };
      }
    }
  }

  async resendOtp(data: ResendOtpDto) {
    const user = await this.userService.getUserById(data.user);
    if (!user) {
      return {
        success: false,
        message: 'User not found with the id provided.',
      };
    } else {
      await this.mailService.sendUserVerificationMail(data.user);
      return {
        success: true,
        message: 'Otp resent successfully.',
      };
    }
  }

  // HELPERS
  async validateUser(email: string, password: string) {
    const foundUser = await this.userModel.findOne({ email });
    if (foundUser) {
      const validPassword = await bcrypt.compare(password, foundUser.password);
      if (!validPassword) {
        return { success: false, message: 'Incorrect password' };
      }
      const user = await this.userModel
        .findById(foundUser.id)
        .populate('role', '_id, name')
        .select({
          password: 0,
          isOAuth: 0,
          createdAt: 0,
          updatedAt: 0,
          __v: 0,
        });
      return { success: true, user: user };
    } else {
      return { success: false, message: 'User not found' };
    }
  }

  async generateJWT(id: string, email: string) {
    const payload = {
      id,
      email,
    };
    const token = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: '1d',
    });
    await this.userService.saveToken(token, id);
    return token;
  }
}
