#!/usr/bin/env node
import { Command } from "commander";
import chalk from "chalk";
import { createProjectCommand } from "./commands/create.js";
import { showBanner } from "./utils/ui.js";

import { createAddHuskyCommand } from "./commands/add/husky.js";
import { createAddPrettierCommand } from "./commands/add/prettier.js";
import { createAddEslintCommand } from "./commands/add/eslint.js";
import { createAddStructureCommand } from "./commands/add/structure.js";

const main = async () => {
  showBanner();

  const program = new Command();
  program.addCommand(createProjectCommand());

  const addCommand = new Command("add")
    .description("Adiciona uma feature de padronização a um projeto existente")
    .addHelpText(
      "afterAll",
      `
${chalk.yellow("Exemplos de Uso:")}

  Use ${chalk.cyan(
    "dopster add <feature>"
  )} para injetar um padrão ou estrutura em um projeto existente.

  ${chalk.cyan("$ dopster add eslint")}      ${chalk.gray(
        "# Adiciona ESLint e a config Dopster"
      )}
  ${chalk.cyan("$ dopster add prettier")}    ${chalk.gray(
        "# Adiciona Prettier e a config Dopster"
      )}
  ${chalk.cyan("$ dopster add husky")}       ${chalk.gray(
        "# Adiciona Husky + lint-staged para pre-commits"
      )}
`
    );

  addCommand.addCommand(createAddHuskyCommand());
  addCommand.addCommand(createAddPrettierCommand());
  addCommand.addCommand(createAddEslintCommand());
  // addCommand.addCommand(createAddStructureCommand());

  program.addCommand(addCommand);

  await program.parseAsync(process.argv);
};

main();
