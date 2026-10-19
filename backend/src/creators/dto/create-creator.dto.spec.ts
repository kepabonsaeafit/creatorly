// Author: Kevin Pabón

// external imports
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

// internal imports
import { CreateCreatorDto } from './create-creator.dto.js';
import { UpdateCreatorDto } from './update-creator.dto.js';

describe('CreateCreatorDto', () => {
  const validCreator = {
    name: 'Andrés Mesa',
    niche: 'gaming',
    contentType: 'YouTube',
    rate: 2400,
    available: true,
  };

  async function getErrorProperties(plain: object): Promise<string[]> {
    const errors = await validate(plainToInstance(CreateCreatorDto, plain));

    return errors.map((error) => error.property);
  }

  it('accepts a complete creator', async () => {
    await expect(getErrorProperties(validCreator)).resolves.toEqual([]);
  });

  it('accepts a creator without the available field', async () => {
    const required = {
      name: validCreator.name,
      niche: validCreator.niche,
      contentType: validCreator.contentType,
      rate: validCreator.rate,
    };

    await expect(getErrorProperties(required)).resolves.toEqual([]);
  });

  it('trims and lowercases the niche', async () => {
    const creator = plainToInstance(CreateCreatorDto, { ...validCreator, niche: '  Gaming ' });

    expect(creator.niche).toBe('gaming');
    await expect(validate(creator)).resolves.toEqual([]);
  });

  it('trims the name without changing its case', async () => {
    const creator = plainToInstance(CreateCreatorDto, { ...validCreator, name: '  Andrés Mesa ' });

    expect(creator.name).toBe('Andrés Mesa');
  });

  it('rejects an empty name', async () => {
    await expect(getErrorProperties({ ...validCreator, name: '' })).resolves.toEqual(['name']);
  });

  it('rejects a niche that is only whitespace', async () => {
    await expect(getErrorProperties({ ...validCreator, niche: '   ' })).resolves.toEqual(['niche']);
  });

  it('rejects a negative rate', async () => {
    await expect(getErrorProperties({ ...validCreator, rate: -1 })).resolves.toEqual(['rate']);
  });
});

describe('UpdateCreatorDto', () => {
  it('accepts a partial update', async () => {
    const changes = plainToInstance(UpdateCreatorDto, { available: false });

    await expect(validate(changes)).resolves.toEqual([]);
  });

  it('trims and lowercases the niche', async () => {
    const changes = plainToInstance(UpdateCreatorDto, { niche: ' FOOD ' });

    expect(changes.niche).toBe('food');
    await expect(validate(changes)).resolves.toEqual([]);
  });

  it('still rejects an invalid field that is sent', async () => {
    const changes = plainToInstance(UpdateCreatorDto, { rate: -5 });
    const errors = await validate(changes);

    expect(errors.map((error) => error.property)).toEqual(['rate']);
  });
});
