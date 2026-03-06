import { deleteUsers } from '../lib/db/queries/user';

export async function handlerReset() {
  await deleteUsers();
  console.log('Database reset successfully');
}
