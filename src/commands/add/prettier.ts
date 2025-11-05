// src/commands/add/prettier.ts
import { Command } from 'commander';
import ora from 'ora';
import chalk from 'chalk';
import { applyPrettier } from '../../standards/prettier.js';
import { detectPackageManager } from '../../utils/project.js';

export const createAddPrettierCommand = (): Command => {
  const command = new Command('prettier'); 
  
  command
    .description('Adiciona Prettier (com config Dopster) ao projeto atual')
    .action(async () => {
      const spinner = ora(chalk.cyan('Configurando Prettier...')).start();
      try {
        const packageManager = detectPackageManager();
        
        await applyPrettier({ packageManager, spinner });

        spinner.succeed(chalk.green('Prettier adicionado com sucesso!'));

      } catch (error) {
        spinner.fail(chalk.red('Falha ao adicionar o Prettier.'));
        if (error instanceof Error) console.error(error.message);
      }
    });
  return command;
};