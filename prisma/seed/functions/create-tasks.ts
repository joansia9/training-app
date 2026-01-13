import { prisma } from '../../client';

export async function createTask() {
  await prisma.task.createMany({
    data: [
      {
        title: 'shower',
        description: 'clean',
        completedDate: '',
        status: 'Complete',
        userId: 'user',
      },
      {
        title: 'eat',
        description: 'cook',
        status: 'InProgress',
        userId: 'user',
      },

      {
        title: 'sleep',
        description: 'zzzz',
        status: 'Incomplete',
        userId: 'user',
      },

      {
        title: 'dance',
        description: 'music',
        status: 'InProgress',
        userId: 'admin',
      },

      {
        title: 'happy',
        description: 'laugh',
        completedDate: new Date(),
        status: 'Complete',
        userId: 'admin',
      },
    ],
  });
}
