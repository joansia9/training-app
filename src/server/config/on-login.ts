import { User } from '../../../prisma/client';

/**
 * Allows developers to implement custom logic to be run when the user
 * logs in, including sending the client to a specific route. This can
 * also be helpful for provisioning new users: creating initial data
 * and/or sending them to a sign-up page. You will know that the user
 * is signing in for the first time if the `user` object has a
 * `lastLogin` value of `null`.
 *
 * If no custom login logic is required, this function should
 * do nothing and return null.
 *
 * @param user The data of the user logging in.
 * @returns A string representing the frontend route to navigate to, or
 * null if no navigation is needed.
 */
// eslint-disable-next-line @typescript-eslint/require-await
export async function customOnLogin(user: User): Promise<string | null> {
  console.log('Running custom on login for user:', user);
  return null;
}
