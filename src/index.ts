import { handlerListAllUsers, handlerLogin, handlerRegister } from './commands/users';
import { type CommandRegistry, registerCommand, runCommand } from './commands/registry';
import { handlerReset } from './commands/reset';
import { handlerFetchFeeds } from './commands/aggregate';
import { handlerAddFeed, handlerListFeeds } from './commands/feeds';
import { handlerFollow, handlerListFeedFollows } from './commands/feed-follows';
import { middlewareLoggedIn } from './middleware';

async function main() {
  const args = process.argv.slice(2);

  if (args.length < 1) {
    console.log('Usage: cli <command> [args...]');
    process.exit(1);
  }

  const cmdName = args[0];
  const cmdArgs = args.slice(1);
  const commandsRegistry: CommandRegistry = {};

  registerCommand(commandsRegistry, 'login', handlerLogin);
  registerCommand(commandsRegistry, 'register', handlerRegister);
  registerCommand(commandsRegistry, 'reset', handlerReset);
  registerCommand(commandsRegistry, 'users', handlerListAllUsers);
  registerCommand(commandsRegistry, 'agg', handlerFetchFeeds);
  registerCommand(commandsRegistry, 'addfeed', middlewareLoggedIn(handlerAddFeed));
  registerCommand(commandsRegistry, 'feeds', handlerListFeeds);
  registerCommand(commandsRegistry, 'follow', middlewareLoggedIn(handlerFollow));
  registerCommand(commandsRegistry, 'following', middlewareLoggedIn(handlerListFeedFollows));

  try {
    await runCommand(commandsRegistry, cmdName, ...cmdArgs);
  } catch (error) {
    if (error instanceof Error) {
      console.error(`Error running command ${cmdName}: ${error.message}`);
    } else {
      console.error(`Error running command ${cmdName}: ${error}`);
    }
    process.exit(1);
  }

  process.exit(0);
}

main();
