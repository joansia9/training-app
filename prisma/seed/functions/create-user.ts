import { ByuAccountType, prisma } from '../../client';

export async function addUser() {
  await prisma.user.create({
    data: {
      firstName: 'Joe',
      lastName: 'Moe',
      netId: 'jm123',
      preferredFirstName: 'j',
      preferredLastName: 'Moe',

      accountType: ByuAccountType.Student,

      roles: ['user'],
      id: 'user',
    },
  });

  await prisma.user.create({
    data: {
      firstName: 'Joey',
      lastName: 'Boe',
      netId: 'jb12345',
      preferredFirstName: 'jay',
      preferredLastName: 'boat',

      accountType: ByuAccountType.Employee,

      roles: ['admin'],
      id: 'admin',
    },
  });
}
