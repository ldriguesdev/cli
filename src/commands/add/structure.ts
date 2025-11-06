import { Command } from "commander";
import chalk from "chalk";
import ora from "ora";
import fs from "fs-extra";
import inquirer from "inquirer";
import path from "path";
import { generateNestCleanArch } from "../../generators/arch/clean-arch.js";
import { generateNestHexagonal } from "../../generators/arch/hexagonal.js";

export const createAddStructureCommand = () => {
  const command = new Command("structure")
    .description(
      "Adiciona uma estrutura de arquitetura (Clean, Hexagonal, etc.) ao projeto atual"
    )
    .action(async () => {
      const spinner = ora();

      try {
        const cwd = process.cwd();
        const pkgPath = path.join(cwd, "package.json");

        if (!fs.existsSync(pkgPath)) {
          console.log(
            chalk.red(
              "❌ Nenhum package.json encontrado. Execute dentro de um projeto válido."
            )
          );
          process.exit(1);
        }

        const pkg = await fs.readJson(pkgPath);
        const isNode = pkg.dependencies?.express || pkg.dependencies?.fastify;
        const isNest = pkg.dependencies?.["@nestjs/core"];

        if (!isNode && !isNest) {
          console.log(
            chalk.red(
              "❌ Tipo de projeto não reconhecido (não parece Node.js nem Nest.js)."
            )
          );
          process.exit(1);
        }

        const { architecture } = await inquirer.prompt([
          {
            type: "list",
            name: "architecture",
            message: "Qual arquitetura deseja adicionar?",
            choices: ["Clean Architecture", "Hexagonal", "MVC"],
          },
        ]);

        spinner.start(`Adicionando estrutura ${architecture}...`);

        switch (architecture) {
          case "Clean Architecture":
            await generateNestCleanArch({ projectPath: cwd, spinner });
            break;
          case "Hexagonal":
            await generateNestHexagonal({ projectPath: cwd, spinner });
            break;
          default:
            console.log(
              chalk.yellow("⚠️ Arquitetura não suportada para Nest.js ainda.")
            );
        }

        spinner.succeed(
          chalk.green(`Estrutura ${architecture} adicionada com sucesso! 🚀`)
        );
      } catch (err: any) {
        spinner.fail(chalk.red(`Erro ao adicionar estrutura: ${err.message}`));
        process.exit(1);
      }
    });

  return command;
};
