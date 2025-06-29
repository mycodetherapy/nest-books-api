import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { InjectModel } from '@nestjs/mongoose';
import { UserDocument } from '../../User/schemas/user.schema';
import { Model } from 'mongoose';

interface JwtPayload {
  id: string;
  email: string;
  firstName: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectModel('User') private userModel: Model<UserDocument>,
    configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.getOrThrow<string>('JWT_SECRET'),
      ignoreExpiration: false,
    });
  }

  async validate(payload: JwtPayload) {
    try {
      const user = await this.userModel.findById(payload.id);
      if (!user) {
        throw new UnauthorizedException('User not found in database');
      }
      return user;
    } catch (error) {
      throw new UnauthorizedException('Invalid token payload' + error);
    }
  }
}
