import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Res,
  UseGuards,
  Req,
  HttpStatus,
  Patch,
} from '@nestjs/common';
import { UserService } from './user.service';
import { Request, Response } from 'express';
import { createBusinessProfileDto } from './dto/createBusinessProfile.dto';
import { UserGuard } from 'src/auth/guards/user.guard';

@Controller('v1/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('createBusinessProfile')
  @UseGuards(UserGuard)
  async createBusinessProfile(
    @Req() req: Request,
    @Res() res: Response,
    @Body() body: createBusinessProfileDto,
  ) {
    const result = await this.userService.createBusinessProfile(
      body,
      req.user['_id'],
    );
    if (result.success) {
      return res.status(HttpStatus.CREATED).json({
        message: result.message,
        businessProfile: result.businessProfile,
      });
    } else {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: result.message,
      });
    }
  }

  @Get('getBusinessProfiles')
  @UseGuards(UserGuard)
  async getBusinessProfiles(@Req() req: Request, @Res() res: Response) {
    const result = await this.userService.getBusinessProfiles(req.user['_id']);
    if (result.success) {
      return res.status(HttpStatus.OK).json({
        message: result.message,
        businessProfiles: result.businessProfiles,
      });
    } else {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: result.message,
      });
    }
  }

  @Get('getBusinessProfile/:id')
  @UseGuards(UserGuard)
  async getBusinessProfile(
    @Req() req: Request,
    @Res() res: Response,
    @Param('id') id: string,
  ) {
    const result = await this.userService.getBusinessProfile(
      id,
      req.user['_id'],
    );
    if (result.success) {
      return res.status(HttpStatus.OK).json({
        message: result.message,
        businessProfile: result.businessProfile,
      });
    } else {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: result.message,
      });
    }
  }

  @Patch('followBusiness/:id')
  @UseGuards(UserGuard)
  async followBusiness(
    @Req() req: Request,
    @Res() res: Response,
    @Param('id') id: string,
  ) {
    const result = await this.userService.followBusiness(id, req.user['_id']);
    if (result.success) {
      return res.status(HttpStatus.OK).json({
        message: result.message,
        businessProfile: result.businessProfile,
      });
    } else {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: result.message,
      });
    }
  }

  @Patch('unfollowBusiness/:id')
  @UseGuards(UserGuard)
  async unfollowBusiness(
    @Req() req: Request,
    @Res() res: Response,
    @Param('id') id: string,
  ) {
    const result = await this.userService.unfollowBusiness(id, req.user['_id']);
    if (result.success) {
      return res.status(HttpStatus.OK).json({
        message: result.message,
        businessProfile: result.businessProfile,
      });
    } else {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: result.message,
      });
    }
  }

  @Get('getFollowers')
  @UseGuards(UserGuard)
  async getFollowers(@Req() req: Request, @Res() res: Response) {
    const result = await this.userService.getFollowers(req.user['_id']);
    if (result.success) {
      return res.status(HttpStatus.OK).json({
        message: result.message,
        followers: result.followers,
      });
    } else {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: result.message,
      });
    }
  }

  @Get('getFollowings')
  @UseGuards(UserGuard)
  async getFollowing(
    @Req() req: Request,
    @Res() res: Response,
    @Param('id') id: string,
  ) {
    const result = await this.userService.getFollowing(req.user['_id']);
    if (result.success) {
      return res.status(HttpStatus.OK).json({
        message: result.message,
        following: result.following,
      });
    } else {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: result.message,
      });
    }
  }

  @Patch('blockUser/:id')
  @UseGuards(UserGuard)
  async blockUser(
    @Req() req: Request,
    @Res() res: Response,
    @Param('id') id: string,
  ) {
    const result = await this.userService.blockUser(id, req.user['_id']);
    if (result.success) {
      return res.status(HttpStatus.OK).json({
        message: result.message,
        user: result.user,
      });
    } else {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: result.message,
      });
    }
  }
}
