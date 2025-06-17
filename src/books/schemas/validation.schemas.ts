import * as Joi from 'joi';
import { CreateBookDto, UpdateBookDto } from '../dto/book.dto';

export const createBookSchema = Joi.object<CreateBookDto>({
  title: Joi.string().required().min(3).max(100),
  description: Joi.string().optional().max(500),
  authors: Joi.array().items(Joi.string().min(3).max(50)).required(),
  fileCover: Joi.string().required(),
  fileName: Joi.string().required(),
  filePath: Joi.string().required(),
  userId: Joi.string().hex().length(24).required(), // MongoDB ObjectId validation
});

export const updateBookSchema = Joi.object<UpdateBookDto>({
  title: Joi.string().min(3).max(100),
  description: Joi.string().max(500),
  authors: Joi.array().items(Joi.string().min(3).max(50)),
  fileCover: Joi.string(),
  fileName: Joi.string(),
  filePath: Joi.string(),
  userId: Joi.string().hex().length(24), // MongoDB ObjectId validation
}).min(1);

export const bookIdParamSchema = Joi.object({
  id: Joi.string().hex().length(24).required(), // MongoDB ObjectId validation
});
