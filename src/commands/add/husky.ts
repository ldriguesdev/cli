// src/commands/add/husky.ts
import { Command } from "commander";
import ora from "ora";
import chalk from "chalk";
import { applyHusky } from "../../standards/husky.js";
import { detectPackageManager } from "../../utils/project.js";

export const createAddHuskyCommand = (): Command => {
  const command = new Command("husky");

  command
    .description("Adiciona Husky + lint-staged ao projeto atual")
    .action(async () => {
      const spinner = ora(chalk.cyan("Configurando Husky...")).start();
      try {
        const packageManager = detectPackageManager();

        await applyHusky({ packageManager, spinner });

        spinner.succeed(
          chalk.green("Husky e lint-staged adicionados com sucesso!")
        );
        console.log(
          chalk.white(
            'Por favor, rode o "prepare script" (ex: npm run prepare) ou reinstale os pacotes.'
          )
        );
      } catch (error) {
        spinner.fail(chalk.red("Falha ao adicionar o Husky."));
        if (error instanceof Error) console.error(error.message);
      }
    });
  return command;
};
