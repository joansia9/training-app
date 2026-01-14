import { createTask } from './task/create-task/create-task';
import { getTasksByUser } from './task/get-tasks-by-user/get-tasks-by-user';
import { router } from './trpc';

export const appRouter = router({
  task: {
    createTask,
    getTasksByUser,
  },
});
