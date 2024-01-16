import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './models/user.model';
import mongoose, { Model } from 'mongoose';
import { Otp, OtpDocument } from 'src/auth/models/otp.model';
import { VerifyOtpDto } from 'src/auth/dto/verifyOtp.dto';
import { ResendOtpDto } from 'src/auth/dto/resendOtp.dto';
import { generateOtp } from 'src/helpers/auth.helpers';
import { Token, TokenDocument } from 'src/auth/models/token.model';
import { TokenTypes } from 'src/enums/auth.enums';
import { createBusinessProfileDto } from './dto/createBusinessProfile.dto';
import {
  BusinessProfile,
  BusinessProfileDocument,
} from './models/businessProfile.model';
import { Following } from './models/following.model';
import { FollowingStatus } from 'src/enums/user.enum';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    @InjectModel(Otp.name) private readonly otpModel: Model<OtpDocument>,
    @InjectModel(Token.name) private readonly tokenModel: Model<TokenDocument>,
    @InjectModel(BusinessProfile.name)
    private readonly businessProfileModel: Model<BusinessProfileDocument>,
    @InjectModel(Following.name)
    private readonly followingModel: Model<Following>,
    private readonly logger: Logger,
  ) {}

  async getUserById(id: string): Promise<User> {
    return await this.userModel.findById(id).select({ password: 0 }).exec();
  }

  private async saveOtpToDb(id: string, otp: number) {
    const savedOtpDoc = await this.otpModel.create({
      otp,
      user: new mongoose.Types.ObjectId(id),
    });
    this.logger.log(`Otp saved successfully ${savedOtpDoc}`);
  }

  async validateOtp(data: VerifyOtpDto) {
    const { user, type, otp } = data;
    const foundOtpDoc = await this.otpModel.findOne({
      user: new mongoose.Types.ObjectId(user),
      type,
    });
    if (!foundOtpDoc) {
      return {
        success: false,
        message: 'Otp Expired, Please resend.',
      };
    } else if (foundOtpDoc.otp !== otp) {
      return {
        success: false,
        message: 'Invalid Otp',
      };
    } else {
      return {
        success: true,
        message: 'Otp verified successfully',
        otp: foundOtpDoc,
      };
    }
  }

  async saveOtp(data: ResendOtpDto) {
    const { user, type } = data;
    const foundOtpDoc = await this.otpModel.findOne({
      user: new mongoose.Types.ObjectId(user),
      type,
    });
    const otp = generateOtp();
    if (!foundOtpDoc) {
      this.saveOtpToDb(user, otp);
    } else {
      foundOtpDoc.otp = otp;
      await foundOtpDoc.save();
    }
    return otp;
  }

  async saveToken(token: string, id: string) {
    await this.tokenModel.create({
      token,
      userId: new mongoose.Types.ObjectId(id),
      type: TokenTypes.ACCESS,
      expiresAt: new Date(Date.now() + 86400000),
    });
  }

  async createBusinessProfile(data: createBusinessProfileDto, userId: string) {
    console.log('<<<<<<<<<<<<<<<<<<<<<<<<<');
    console.log(userId);

    const createdBusinessProfile = await this.businessProfileModel.create({
      ...data,
      authorisedUser: new mongoose.Types.ObjectId(userId),
      createdBy: new mongoose.Types.ObjectId(userId),
    });
    if (createdBusinessProfile) {
      await this.userModel.updateOne(
        { _id: new mongoose.Types.ObjectId(userId) },
        { $set: { businessProfile: createdBusinessProfile._id } },
      );
      return {
        success: true,
        message: 'Business profile created successfully',
        businessProfile: createdBusinessProfile,
      };
    } else {
      return {
        success: false,
        message: 'Something went wrong',
      };
    }
  }

  async getBusinessProfiles(userId: string) {
    const businessProfiles = await this.businessProfileModel.find({
      authorisedUser: new mongoose.Types.ObjectId(userId),
    });
    return {
      success: true,
      message: 'Business profiles fetched successfully',
      businessProfiles,
    };
  }

  async getBusinessProfile(id: string, userId: string) {
    let businessProfile: any;
    const businessProfileDoc = await this.businessProfileModel
      .findById(id)
      .populate('authorisedUser', 'firstName lastName email profilePhoto')
      .exec();
    if (!businessProfileDoc) {
      return {
        success: false,
        message: 'Business profile not found',
      };
    } else if (
      businessProfileDoc.authorisedUser == new mongoose.Types.ObjectId(userId)
    ) {
      businessProfile = businessProfileDoc;
    } else {
      const userBlocked = await this.followingModel.findOne({
        user: new mongoose.Types.ObjectId(userId),
        businessProfile: new mongoose.Types.ObjectId(id),
        status: FollowingStatus.BLOCKED,
      });
      if (userBlocked) {
        return {
          success: false,
          message: 'You are blocked by this business profile',
        };
      } else {
        businessProfile = {
          status: businessProfileDoc.status,
          authorisedUser: businessProfileDoc.authorisedUser,
          image: businessProfileDoc.image,
          name: businessProfileDoc.name,
          bio: businessProfileDoc.bio,
          locations: businessProfileDoc.locations,
          countryCode: businessProfileDoc.countryCode,
          phone: businessProfileDoc.phone,
          email: businessProfileDoc.email,
          website: businessProfileDoc.website,
          address: businessProfileDoc.address,
          city: businessProfileDoc.city,
          state: businessProfileDoc.state,
          country: businessProfileDoc.country,
          postCode: businessProfileDoc.postCode,
          foundationYear: businessProfileDoc.foundationYear,
          menu: businessProfileDoc.menu,
        };
      }
    }
    return {
      success: true,
      message: 'Business profile fetched successfully',
      businessProfile,
    };
  }

  async followBusiness(id: string, userId: string) {
    const businessProfile = await this.businessProfileModel.findById(id);
    if (!businessProfile) {
      return {
        success: false,
        message: 'Business profile not found',
      };
    } else {
      const following = await this.followingModel.findOne({
        user: new mongoose.Types.ObjectId(userId),
        businessProfile: new mongoose.Types.ObjectId(id),
      });
      if (following) {
        return {
          success: false,
          message: 'Already following',
        };
      } else {
        await this.followingModel.create({
          user: new mongoose.Types.ObjectId(userId),
          businessProfile: new mongoose.Types.ObjectId(id),
        });
        await this.businessProfileModel.updateOne(
          {
            _id: new mongoose.Types.ObjectId(id),
          },
          {
            $inc: { followersCount: 1 },
          },
        );
        return {
          success: true,
          message: 'Followed successfully',
          businessProfile,
        };
      }
    }
  }

  async unfollowBusiness(id: string, userId: string) {
    const businessProfile = await this.businessProfileModel.findById(id);
    if (!businessProfile) {
      return {
        success: false,
        message: 'Business profile not found',
      };
    } else {
      const following = await this.followingModel.findOne({
        user: new mongoose.Types.ObjectId(userId),
        businessProfile: new mongoose.Types.ObjectId(id),
      });
      if (!following) {
        return {
          success: false,
          message:
            'Failed to unfollow as you are not following this profile already',
        };
      } else {
        await this.followingModel.deleteOne({
          user: new mongoose.Types.ObjectId(userId),
          businessProfile: new mongoose.Types.ObjectId(id),
        });
        await this.businessProfileModel.updateOne(
          {
            _id: new mongoose.Types.ObjectId(id),
          },
          {
            $inc: { followersCount: -1 },
          },
        );
        return {
          success: true,
          message: 'Unfollowed successfully',
          businessProfile,
        };
      }
    }
  }

  async getFollowers(id: string) {
    const followers = await this.followingModel
      .find({
        businessProfile: new mongoose.Types.ObjectId(id),
      })
      .populate('user', 'firstName lastName email profilePhoto')
      .exec();
    return {
      success: true,
      message: 'Followers fetched successfully',
      followers,
    };
  }

  async getFollowing(id: string) {
    const following = await this.followingModel
      .find({
        user: new mongoose.Types.ObjectId(id),
      })
      .populate('businessProfile', 'name image')
      .exec();
    return {
      success: true,
      message: 'Following fetched successfully',
      following,
    };
  }

  async blockUser(id: string, userId: string) {
    const following = await this.followingModel
      .findOne({
        user: new mongoose.Types.ObjectId(userId),
        businessProfile: new mongoose.Types.ObjectId(id),
      })
      .exec();
    if (!following) {
      return {
        success: false,
        message: 'User not found in following list',
      };
    } else {
      following.status = FollowingStatus.BLOCKED;
      await following.save();
      return {
        success: true,
        message: 'User blocked successfully',
        user: following,
      };
    }
  }
}
