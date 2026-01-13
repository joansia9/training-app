import { prisma } from '../../client';

export async function deleteAll() {
  await prisma.task.deleteMany({});
  await prisma.user.deleteMany({});
}
