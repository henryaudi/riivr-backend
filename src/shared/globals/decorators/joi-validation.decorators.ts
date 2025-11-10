/* eslint-disable @typescript-eslint/no-explicit-any */
import { JoiRequestValidationError } from '@global/helpers/error-handler';
import { Request } from 'express';
import { ObjectSchema } from 'joi';

type IJoiDecorator = (target: any, key: string, descriptor: PropertyDescriptor) => PropertyDescriptor | void;

/**
 * Joi validation decorator factory.
 *
 * Wraps a class method (typically an Express controller) with automatic request
 * body validation using a provided Joi schema.
 *
 * @param schema - Joi ObjectSchema defining the validation rules.
 * @returns A method decorator that wraps the original method with validation logic.
 */
export function joiValidation(schema: ObjectSchema): IJoiDecorator {
  return (_target: any, _key: string, descriptor: PropertyDescriptor) => {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      const req: Request = args[0];
      const { error } = await Promise.resolve(schema.validate(req.body));

      if (error?.details) {
        throw new JoiRequestValidationError(error.details[0].message);
      }

      return originalMethod.apply(this, args);
    };
    return descriptor;
  };
}
