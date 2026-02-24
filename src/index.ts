import { handlerListAllUsers, handlerLogin, handlerRegister } from './commands/users';
import { type CommandRegistry, registerCommand, runCommand } from './commands/registry';
import { handlerReset } from './commands/reset';

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
