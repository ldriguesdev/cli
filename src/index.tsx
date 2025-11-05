#!/usr/bin/env node
import { Command } from "commander";
import { createProjectCommand } from "./commands/create.js";
import { showBanner } from "./utils/ui.js";

const main = async () => {
  showBanner();

  const program = new Command();

  program
    .name("dopster")
    .description("CLI para padronização de projetos na Dopster")
    .version("1.0.0");

  program.addCommand(createProjectCommand());

  await program.parseAsync(process.argv);
};

main();
