import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';
@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      usernameField: 'email',
    });
  }
  async validate(email: string, password: string) {
    const validatedUser = await this.authService.validateUser(email, password);
    if (!validatedUser.success) {
      throw new UnauthorizedException({
        message: validatedUser.message,
      });
    }
    return validatedUser.user;
  }
}