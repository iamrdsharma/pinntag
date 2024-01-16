import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  Res,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';
import { ContinueWithFacebookDto } from './dto/continueWithFb.dto';
import { LoginDto } from './dto/login.dto';
import { VerifyOtpDto } from './dto/verifyOtp.dto';
import { ResendOtpDto } from './dto/resendOtp.dto';
import { ResetPaswordDto } from './dto/resetPass.dto';
import { UserGuard } from './guards/user.guard';

@Controller('v1/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async create(@Res() res: Response, @Body() createAuthDto: CreateAuthDto) {
    const result = await this.authService.create(createAuthDto);
    if (result.success) {
      return res.status(HttpStatus.CREATED).json({
        message: result.message,
        user: result.user,
      });
    } else {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: result.message,
      });
    }
  }

  @Post('login')
  async login(@Res() res: Response, @Body() loginDto: LoginDto) {
    const result = await this.authService.login(loginDto);
    if (result.success) {
      return res.status(HttpStatus.OK).json({
        message: result.message,
        user: result.user,
        token: result.token,
      });
    } else {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: result.message,
      });
    }
  }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth(@Req() req: Request) {}

  @Get('google/redirect')
  @UseGuards(AuthGuard('google'))
  googleAuthRedirect(@Req() req) {
    return this.authService.googleLogin(req);
  }

  @Post('continueWithFacebook')
  async facebookAuth(@Body() body: ContinueWithFacebookDto) {
    return this.authService.continueWithFacebook(body);
  }

  @Post('verify/otp')
  async verifyEmail(@Res() res: Response, @Body() body: VerifyOtpDto) {
    const result = await this.authService.verifyOtp(body);
    if (result.success) {
      return res.status(HttpStatus.OK).json({
        message: result.message,
      });
    } else {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: result.message,
      });
    }
  }

  @Post('resend/otp')
  async resendOtp(@Res() res: Response, @Body() body: ResendOtpDto) {
    const { success, message } = await this.authService.resendOtp(body);
    const status = success ? HttpStatus.OK : HttpStatus.BAD_REQUEST;
    return res.status(status).json({
      message,
    });
  }

  @Post('forgotPassword')
  async forgotPassword(@Res() res: Response, @Body() body: { email: string }) {
    const result = await this.authService.forgotPassword(body.email);
    if (result.success) {
      const { id, message } = result;
      return res.status(HttpStatus.OK).json({
        id,
        message,
      });
    } else {
      const { message } = result;
      return res.status(HttpStatus.BAD_REQUEST).json({
        message,
      });
    }
  }

  @Post('resetPassword')
  async resetPassword(@Res() res: Response, @Body() body: ResetPaswordDto) {
    const { success, message } = await this.authService.resetPassword(body);
    const status = success ? HttpStatus.OK : HttpStatus.BAD_REQUEST;
    return res.status(status).json({
      message,
    });
  }
  @Get('dashboard')
  @UseGuards(UserGuard)
  async dashboard(@Req() res: Response) {
    return res.json({
      success: true,
    });
  }
}
