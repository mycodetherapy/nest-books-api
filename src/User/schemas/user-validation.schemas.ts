import * as Joi from 'joi';
import { SignUpDto } from '../../auth/dto/signup.dto';
import { SignInDto } from '../../auth/dto/signin.dto';

export const signUpSchema = Joi.object<SignUpDto>({
  email: Joi.string().email().required(),
  firstName: Joi.string().required().min(2).max(50),
  password: Joi.string().required().min(6).max(30),
});

export const signInSchema = Joi.object<SignInDto>({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

export const userIdParamSchema = Joi.object({
  id: Joi.string().hex().length(24).required(),
});
