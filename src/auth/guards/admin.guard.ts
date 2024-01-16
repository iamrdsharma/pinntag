import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
  } from '@nestjs/common';
  import { JwtService } from '@nestjs/jwt';
  import { InjectModel } from '@nestjs/mongoose';
  import { Request } from 'express';
  import { Model } from 'mongoose';
  import { Roles } from 'src/enums/user.enum';
  import { Role, RoleDocument } from 'src/models/role.model';
  import { User, UserDocument } from 'src/user/models/user.model';
  
  @Injectable()
  export class AdminGuard implements CanActivate {
    constructor(
      private jwtService: JwtService,
      @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
      @InjectModel(Role.name) private readonly roleModel: Model<RoleDocument>,
    ) {}
  
    async canActivate(context: ExecutionContext): Promise<boolean> {
      const request = context.switchToHttp().getRequest();
      const response = context.switchToHttp().getResponse();
      const token = this.extractTokenFromHeader(request);
      if (!token) {
        throw new UnauthorizedException('Unauthorised. Please provide a token.');
      }
      try {
        const payload = await this.jwtService.verifyAsync(token, {
          secret: process.env.JWT_SECRET,
        });
        const roleId = (await this.roleModel.findOne({ name: Roles.ADMIN }))._id;
        const user = JSON.parse(
          JSON.stringify(
            await this.userModel.findById(payload.id).populate('role').exec(),
          ),
        );
        if (roleId != user.role._id) {
          throw new UnauthorizedException(
            'The service is only accesible for admins',
            '402',
          );
        } else {
          request['user'] = user;
        }
      } catch (error) {
        console.log('error message:---', error.name);
        if (error.name == 'TokenExpiredError') {
          throw new UnauthorizedException('Token expired');
        } else if (error.name == 'UnauthorizedException') {
          throw new UnauthorizedException(error.message);
        }
      }
      return true;
    }
  
    private extractTokenFromHeader(request: Request): string | undefined {
      const [type, token] = request.headers.authorization?.split(' ') ?? [];
      return type === 'Bearer' ? token : undefined;
    }
  }
  