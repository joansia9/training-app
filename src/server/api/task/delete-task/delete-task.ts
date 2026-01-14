import { z } from 'zod';
import { authorizedProcedure } from '../../trpc';

const deleteTaskInput = z.object({});

const deleteTaskOutput = z.object({});

export const deleteTask = authorizedProcedure
  .meta({ requiredPermissions: ['manage-task'] })
  .input(deleteTaskInput)
  .output(deleteTaskOutput)
  .mutation(async opts => {});
