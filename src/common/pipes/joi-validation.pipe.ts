import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { ObjectSchema } from 'joi';

@Injectable()
export class JoiValidationPipe<T> implements PipeTransform<T> {
  constructor(private readonly schema: ObjectSchema) {}

  transform(value: T): T {
    const { error } = this.schema.validate(value, { abortEarly: false });
    if (error) {
      throw new BadRequestException({
        message: 'Validation failed',
        details: error.details.map((d) => d.message),
      });
    }
    return value;
  }
}
