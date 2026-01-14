import { z } from 'zod';
import { authorizedProcedure } from '../../trpc';
import { prisma, TaskStatus } from '../../../../../prisma/client';

const createTaskInput = z.object({
  title: z.string(),
  description: z.string(),
  status: z.enum(TaskStatus),
});

const createTaskOutput = z.object({
  id: z.string(),
});

export const createTask = authorizedProcedure
  .meta({ requiredPermissions: ['manage-task'] })
  .input(createTaskInput)
  .output(createTaskOutput)
  .mutation(async opts => {
    const task = await prisma.task.create({
      data: {
        title: opts.input.title,
        description: opts.input.description,
        status: opts.input.status,
        userId: opts.ctx.userId,
      },
    });
    return { id: task.id };
  });
