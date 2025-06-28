import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JoiValidationPipe } from '../common/pipes/joi-validation.pipe';
import {
  signInSchema,
  signUpSchema,
} from '../User/schemas/user-validation.schemas';
import { SignUpDto } from './dto/signup.dto';
import { SignInDto } from './dto/signin.dto';

@Controller({
  path: 'auth',
  version: '1',
})
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signUp(
    @Body(new JoiValidationPipe(signUpSchema)) signUpDto: SignUpDto,
  ) {
    return this.authService.signUp(signUpDto);
  }

  @Post('signin')
  async signIn(
    @Body(new JoiValidationPipe(signInSchema)) signInDto: SignInDto,
  ) {
    return this.authService.signIn(signInDto);
  }
}
