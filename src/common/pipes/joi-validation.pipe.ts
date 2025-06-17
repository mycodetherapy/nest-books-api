import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';
import { ObjectSchema } from 'joi';

@Injectable()
export class JoiValidationPipe implements PipeTransform {
  constructor(private readonly schema: ObjectSchema) {}

  transform(value: any, metadata: ArgumentMetadata) {
    const validationObject = metadata.type === 'param' ? { id: value } : value;

    const { error, value: validatedValue } = this.schema.validate(
      validationObject,
      {
        abortEarly: false,
        stripUnknown: true,
      },
    );

    if (error) {
      throw new BadRequestException({
        status: 'fail',
        message: 'Validation failed',
        details: error.details.map((d) => ({
          message: d.message,
          path: d.path,
        })),
        code: 'VALIDATION_ERROR',
      });
    }

    return metadata.type === 'param' ? validatedValue.id : validatedValue;
  }
}
