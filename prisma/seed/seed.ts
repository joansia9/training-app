import { defineOptions, SeedArguments } from './types';
import { prisma } from '../client';
import { deleteAll } from './functions/delete-all';

export const options = defineOptions({});

export async function seed(args?: SeedArguments) {
  await deleteAll();
}
