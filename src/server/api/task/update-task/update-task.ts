import { z } from 'zod';
import { authorizedProcedure } from '../../trpc';
import { prisma, TaskStatus } from '../../../../../prisma/client';
import { rethrowKnownPrismaError } from '@fhss-web-team/backend-utils';

const updateTaskInput = z.object({
  id: z.string(),
  newStatus: z.enum(TaskStatus), //added optional part bc if statement always truthy error
  newDescription: z.string(),
  newTitle: z.string(),
});

const updateTaskOutput = z.object({
  status: z.enum(TaskStatus),
  completedDate: z.date().nullable(),
  title: z.string(),
  description: z.string(),

  userId: z.string(),
});

export const updateTask = authorizedProcedure
  .meta({ requiredPermissions: ['manage-task'] })
  .input(updateTaskInput)
  .output(updateTaskOutput)
  .mutation(async opts => {
    try {
      const oldTask = await prisma.task.findUniqueOrThrow({
        where: {
          id: opts.input.id,
          userId: opts.ctx.userId,
        },
      });

      // completed date
      let calculateCompleteAt: Date | null = oldTask.completedDate;

      // status

      if (opts.input.newStatus != oldTask.status) {
        if (opts.input.newStatus == 'Complete') {
          //calculate completed at
          calculateCompleteAt = new Date();
        }

        // not complete
        else if (oldTask.status === 'Complete') {
          //complete date = null
          calculateCompleteAt = null;
        }
      }

      return await prisma.task.update({
        where: {
          id: oldTask.id,
          userId: opts.ctx.userId,
        },
        data: {
          completedDate: calculateCompleteAt,
          description: opts.input.newDescription,
          status: opts.input.newStatus,
          title: opts.input.newTitle,
        },
      });
    } catch (error) {
      rethrowKnownPrismaError(error);
      throw error;
    }
  });
