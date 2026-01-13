import { getTasksByUser } from './task/get-tasks-by-user/get-tasks-by-user';
import { createUser } from './admin/user/create-user/create-user';
import { router } from './trpc';

export const appRouter = router({
  task: {
    getTasksByUser,
  },
  admin: {
    user: {
      createUser,
    },
  },});
