import { defineOptions, SeedArguments } from './types';
import { prisma } from '../client';
import { deleteAll } from './functions/delete-all';
import { createTask } from './functions/create-tasks';
import { addUser } from './functions/create-user';

export const options = defineOptions({
  tasks: {
    description: 'Generate a given set of tasks',
    type: 'boolean',
    short: 't',
  },
});

export async function seed(args?: SeedArguments) {
  await deleteAll();
  await addUser();

  if (args?.tasks) {
    await createTask();
  }
}
