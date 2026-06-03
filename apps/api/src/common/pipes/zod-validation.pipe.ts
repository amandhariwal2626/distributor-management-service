import { BadRequestException, PipeTransform } from '@nestjs/common';
import type { ZodType } from 'zod/v4';
import type { $ZodIssue } from 'zod/v4/core';

export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: ZodType) {}

  transform(value: unknown) {
    const result = this.schema.safeParse(value);
    if (!result.success) {
      const messages = result.error.issues
        .map((e: $ZodIssue) => `${e.path.join('.')}: ${e.message}`)
        .join('; ');
      throw new BadRequestException(messages);
    }
    return result.data;
  }
}
