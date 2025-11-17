/* eslint-disable @typescript-eslint/no-explicit-any */
import { JoiRequestValidationError } from '@global/helpers/error-handler';
import { Request } from 'express';
import { ObjectSchema } from 'joi';

type IJoiDecorator = (target: any, key: string, descriptor: PropertyDescriptor) => PropertyDescriptor | void;

export function joiValidation(schema: ObjectSchema): IJoiDecorator {
  return (_target: any, _key: string, descriptor: PropertyDescriptor) => {
    const originalMethod = descriptor.value;

    // Replace the original method with a wrapped version that includes validation.
    descriptor.value = async function (...args: any[]) {
      const req: Request = args[0];
      const { error } = await Promise.resolve(schema.validate(req.body));

      if (error?.details) {
        throw new JoiRequestValidationError(error.details[0].message);
      }

      // If validation passes, proceed to call the original method.
      return originalMethod.apply(this, args);
    };

    return descriptor;
  };
}
