// Author: Kevin Pabón

// external imports
import { Transform } from 'class-transformer';

/** Lowercases a string property; other values pass through untouched. */
export function ToLowerCase(): PropertyDecorator {
  return Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.toLowerCase() : value,
  );
}
