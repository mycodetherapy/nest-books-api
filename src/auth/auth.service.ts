import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { SignInDto } from './dto/signin.dto';
import { SignUpDto } from './dto/signup.dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { User, UserDocument } from '../User/schemas/user.schema';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    private readonly jwtService: JwtService,
  ) {}

  async signUp(signUpDto: SignUpDto): Promise<{ accessToken: string }> {
    try {
      const hashedPassword = await this.hashPassword(signUpDto.password);
      const user = await this.userModel.create({
        ...signUpDto,
        password: hashedPassword,
      });
      return this.generateToken(user);
    } catch (err) {
      throw new UnauthorizedException('Registration failed' + err);
    }
  }

  async signIn(signInDto: SignInDto): Promise<{ accessToken: string }> {
    try {
      const user = await this.validateUser(signInDto);
      return this.generateToken(user);
    } catch (err) {
      throw new UnauthorizedException('Authentication failed' + err);
    }
  }

  private async generateToken(
    user: UserDocument,
  ): Promise<{ accessToken: string }> {
    if (!user._id || !(user._id instanceof Types.ObjectId)) {
      throw new UnauthorizedException('Invalid User data');
    }

    const payload: JwtPayload = {
      id: user._id.toString(),
      email: user.email,
      firstName: user.firstName,
    };

    return {
      accessToken: await this.jwtService.signAsync(payload),
    };
  }

  private async validateUser(signInDto: SignInDto): Promise<UserDocument> {
    const { email, password } = signInDto;
    const user = await this.userModel.findOne({ email }).exec();

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return user;
  }

  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }
}
