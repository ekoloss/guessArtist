import { PipeTransform, BadRequestException } from '@nestjs/common';
import * as Joi from 'joi';

export class ValidatorPipe<T> implements PipeTransform<T> {
  constructor(private readonly schema: Joi.ObjectSchema | Joi.ArraySchema) {}

  public transform(value: T): T {
    const result = this.schema.validate(value);

    if (result.error) {
      const errorMessages = result.error.details.map((d) => d.message).join();
      throw new BadRequestException(errorMessages);
    }

    return result.value;
  }
}
