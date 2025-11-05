// src/commands/add/eslint.ts
import { Command } from "commander";
import ora from "ora";
import chalk from "chalk";
import { applyEslint } from "../../standards/eslint.js";
import { detectPackageManager } from "../../utils/project.js";

export const createAddEslintCommand = (): Command => {
  const command = new Command("eslint");

  command
    .description("Adiciona ESLint (com config Dopster) ao projeto atual")
    .action(async () => {
      const spinner = ora(chalk.cyan("Configurando ESLint...")).start();
      try {
        const packageManager = detectPackageManager();

        await applyEslint({ packageManager, spinner });

        spinner.succeed(chalk.green("ESLint adicionado com sucesso!"));
        console.log(
          chalk.white(
            'Rode "npm run lint" (ou similar) para verificar seu código.'
          )
        );
      } catch (error) {
        spinner.fail(chalk.red("Falha ao adicionar o ESLint."));
        if (error instanceof Error) console.error(error.message);
      }
    });
  return command;
};
