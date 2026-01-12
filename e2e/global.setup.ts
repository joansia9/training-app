import { test } from '@playwright/test';
import { seed } from '../prisma/seed/seed';

test('Seed Database', async () => {
  await seed();
});
