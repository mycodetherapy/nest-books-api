import * as Joi from 'joi';
import { CreateBookDto, UpdateBookDto, BookIdParamDto } from '../dto/book.dto';

export const createBookSchema = Joi.object<CreateBookDto>({
  title: Joi.string().required().min(3).max(100),
  author: Joi.string().required().min(3).max(50),
  description: Joi.string().optional().max(500),
});

export const updateBookSchema = Joi.object<UpdateBookDto>({
  title: Joi.string().min(3).max(100),
  author: Joi.string().min(3).max(50),
  description: Joi.string().max(500),
}).min(1);

export const bookIdParamSchema = Joi.object<BookIdParamDto>({
  id: Joi.number().integer().positive().required(),
});
