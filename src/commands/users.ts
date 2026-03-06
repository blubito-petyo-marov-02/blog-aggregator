import { createUser, getAllUsers, getUserByName } from 'src/lib/db/queries/user';
import { readConfig, setUser } from '../config';

export async function handlerLogin(cmdName: string, ...args: string[]) {
  if (args.length !== 1) {
    throw new Error(`Usage: ${cmdName} <username>`);
  }

  const username = args[0];
  const user = await getUserByName(username);
  if (!user) {
    throw new Error(`User ${username} not found`);
  }

  setUser(user.name);
  console.log('User switched successfully');
}

export async function handlerRegister(cmdName: string, ...args: string[]) {
  if (args.length !== 1) {
    throw new Error(`Usage: ${cmdName} <name>`);
  }

  const username = args[0];
  const user = await createUser(username);
  if (!user) {
    throw new Error(`Failed to register user ${username}`);
  }

  setUser(user.name);
  console.log(`User ${username} registered successfully`);
}

export async function handlerListAllUsers(_: string) {
  const users = await getAllUsers();
  const config = readConfig();

  for (const user of users) {
    if (user.name === config.currentUserName) {
      console.log(`* ${user.name} (current)`);
      continue;
    }
    console.log(`* ${user.name}`);
  }
}
