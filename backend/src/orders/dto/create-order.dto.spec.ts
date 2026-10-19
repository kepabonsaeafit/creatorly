// Author: Kevin Pabón

// external imports
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

// internal imports
import { CreateOrderDto } from './create-order.dto.js';
import { UpdateOrderDto } from './update-order.dto.js';

describe('CreateOrderDto', () => {
  const validOrder = {
    description: 'Unboxing video',
    budget: 500000,
    requestDate: '2026-10-11',
    deliveryDate: null,
    status: 'requested',
    brandId: 1,
    creatorId: null,
    userId: 1,
  };

  async function getErrorProperties(plain: object): Promise<string[]> {
    const errors = await validate(plainToInstance(CreateOrderDto, plain));

    return errors.map((error) => error.property);
  }

  it('accepts a complete order with null deliveryDate and creatorId', async () => {
    await expect(getErrorProperties(validOrder)).resolves.toEqual([]);
  });

  it('accepts an order without the fields that have a default', async () => {
    const required = {
      description: validOrder.description,
      budget: validOrder.budget,
      brandId: validOrder.brandId,
      userId: validOrder.userId,
    };

    await expect(getErrorProperties(required)).resolves.toEqual([]);
  });

  it('accepts dates written as YYYY-MM-DD', async () => {
    await expect(
      getErrorProperties({ ...validOrder, deliveryDate: '2026-10-30' }),
    ).resolves.toEqual([]);
  });

  it.each(['24/12/2026', '2026-2-3', '2026-10-11T10:00:00Z', 'tomorrow', '2026-02-30'])(
    'rejects the requestDate %s',
    async (requestDate) => {
      await expect(getErrorProperties({ ...validOrder, requestDate })).resolves.toEqual([
        'requestDate',
      ]);
    },
  );

  it('rejects a deliveryDate that is not YYYY-MM-DD', async () => {
    await expect(
      getErrorProperties({ ...validOrder, deliveryDate: '30/10/2026' }),
    ).resolves.toEqual(['deliveryDate']);
  });

  it('rejects a status outside the lifecycle', async () => {
    await expect(getErrorProperties({ ...validOrder, status: 'paused' })).resolves.toEqual([
      'status',
    ]);
  });

  it('rejects a negative budget and a missing brandId', async () => {
    await expect(
      getErrorProperties({ ...validOrder, budget: -1, brandId: undefined }),
    ).resolves.toEqual(['budget', 'brandId']);
  });

  it('trims the description before validating it', async () => {
    const order = plainToInstance(CreateOrderDto, { ...validOrder, description: '  Unboxing  ' });

    expect(order.description).toBe('Unboxing');
    await expect(validate(order)).resolves.toEqual([]);
  });

  it('rejects a description that is only whitespace', async () => {
    await expect(getErrorProperties({ ...validOrder, description: '   ' })).resolves.toEqual([
      'description',
    ]);
  });
});

describe('UpdateOrderDto', () => {
  it('accepts a partial update', async () => {
    const changes = plainToInstance(UpdateOrderDto, { status: 'approved' });

    await expect(validate(changes)).resolves.toEqual([]);
  });

  it('still rejects an invalid field that is sent', async () => {
    const changes = plainToInstance(UpdateOrderDto, { deliveryDate: '30/10/2026' });
    const errors = await validate(changes);

    expect(errors.map((error) => error.property)).toEqual(['deliveryDate']);
  });
});
