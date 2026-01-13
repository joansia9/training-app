import { z } from 'zod';
import { authorizedProcedure } from '../../trpc';
import { prisma, TaskStatus } from '../../../../../prisma/client';

const getTasksByUserInput = z.object({
  pageSize: z.number(),
  pageXOffset: z.number(),
});

const getTasksByUserOutput = z.object({
  data: z.array(
    z.object({
      id: z.string(),
      createdAt: z.date(),
      updatedAt: z.date(),
      title: z.string(),
      description: z.string(),
      completedDate: z.date().nullable(),
      status: z.literal(Object.values(TaskStatus)),
      userId: z.string(),
    })
  ),
  totalCount: z.number(),
});

export const getTasksByUser = authorizedProcedure
  .meta({ requiredPermissions: ['manage-task'] })
  .input(getTasksByUserInput)
  .output(getTasksByUserOutput)
  .mutation(async opts => {
    const total = await prisma.task.count({
      where: {
        userId: opts.ctx.userId,
      },
    });

    const tasks = await prisma.task.findMany({
      where: {
        userId: opts.ctx.userId,
      },
      orderBy: { createdAt: 'desc' },
      take: opts.input.pageSize,
      skip: opts.input.pageXOffset,
    });

    return { data: tasks, totalCount: total };
  });
