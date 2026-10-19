// Author: Kevin Pabón

// external imports
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

// internal imports
import { SignInDto } from './sign-in.dto.js';

describe('SignInDto', () => {
  it('trims and lowercases the email', async () => {
    const credentials = plainToInstance(SignInDto, {
      email: '  Laura@Creatorly.com ',
      password: '1234',
    });

    expect(credentials.email).toBe('laura@creatorly.com');
    await expect(validate(credentials)).resolves.toEqual([]);
  });

  it('rejects an email with an invalid format', async () => {
    const errors = await validate(plainToInstance(SignInDto, { email: 'laura', password: '1234' }));

    expect(errors.map((error) => error.property)).toEqual(['email']);
  });

  it('rejects an empty password', async () => {
    const errors = await validate(
      plainToInstance(SignInDto, { email: 'laura@creatorly.com', password: '' }),
    );

    expect(errors.map((error) => error.property)).toEqual(['password']);
  });
});
