
import type { CommandHandler, UserCommandHandler } from './commands/registry';
import { readConfig } from './config';
import { getUserByName } from './lib/db/queries/user';


export function middlewareLoggedIn(handler: UserCommandHandler): CommandHandler {
  return async (cmdName: string, ...args: string[]): Promise<void> => {
    const { currentUserName } = readConfig();
    const user = await getUserByName(currentUserName);

    if (!user) {
      throw new Error(`User ${currentUserName} not found`);
    }

    return handler(cmdName, user, ...args);
  };
}
