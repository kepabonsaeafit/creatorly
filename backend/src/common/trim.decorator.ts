// Author: Kevin Pabón

// external imports
import { Transform } from 'class-transformer';

/** Trims leading and trailing whitespace of a string property; other values pass through untouched. */
export function Trim(): PropertyDecorator {
  return Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim() : value,
  );
}
