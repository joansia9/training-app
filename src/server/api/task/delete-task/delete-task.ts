import { z } from 'zod';
import { authorizedProcedure } from '../../trpc';
import { prisma } from '../../../../../prisma/client';
import { rethrowKnownPrismaError } from '@fhss-web-team/backend-utils';

const deleteTaskInput = z.object({
  id: z.string(),
});

const deleteTaskOutput = z.void({});

export const deleteTask = authorizedProcedure
  .meta({ requiredPermissions: ['manage-task'] })
  .input(deleteTaskInput)
  .output(deleteTaskOutput)
  .mutation(async opts => {
    try {
      await prisma.user.delete({
        where: {
          id: opts.input.id,
        },
      });
    } catch (error) {
      rethrowKnownPrismaError(error);
      throw error;
    }
  });
