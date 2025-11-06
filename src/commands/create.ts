import { Command } from "commander";
import chalk from "chalk";
import inquirer from "inquirer";
import ora from "ora";
import path from "path";
import fs from "fs";
import { Framework, ProjectOptions } from "../types/index.js";

import { generateNextJs } from "../generators/nextjs.js";
import { generateNodeJs } from "../generators/nodejs.js";
import { generateNestJs } from "../generators/nestjs.js";
import { generateReact } from "../generators/react.js";
import { GeneratorOptions } from "../types/index.js";

const generators: Record<
  Framework,
  (options: GeneratorOptions) => Promise<void>
> = {
  "Next.js": generateNextJs,
  "Node.js": generateNodeJs,
  "Nest.js": generateNestJs,
  "React.js": generateReact,
};

export const createProjectCommand = (): Command => {
  const command = new Command("create");

  command
    .description("Cria um novo projeto padronizado")
    .argument("[name]", "Opcional: nome do projeto")
    .action(async (name: string | undefined) => {
      const answers = await inquirer.prompt<ProjectOptions>([
        {
          type: "list",
          name: "framework",
          message: "Qual tipo de projeto você deseja criar?",
          choices: ["Next.js", "React.js", "Node.js", "Nest.js"],
        },
        {
          type: "list",
          name: "architecture",
          message: "Qual estrutura de projeto você deseja seguir?",
          choices: ["Clean Architecture", "Hexagonal", "MVC"],
          default: "Clean Architecture",
        },
        {
          type: "input",
          name: "projectName",
          message: "Qual o nome do seu projeto?",
          default: "my-dopster-project",
          when: !name,
        },
        {
          type: "list",
          name: "packageManager",
          message: "Qual gerenciador de pacotes você deseja usar?",
          choices: ["npm", "yarn", "pnpm"],
          default: "npm",
        },
      ]);

      const projectName = name || answers.projectName;
      const { framework, packageManager } = answers;

      if (!projectName) {
        console.log(chalk.red("Erro: O nome do projeto não foi fornecido."));
        process.exit(1);
      }

      const projectPath = path.join(process.cwd(), projectName);

      if (fs.existsSync(projectPath)) {
        console.log(
          chalk.red(
            `O diretório "${projectName}" já existe. Por favor, escolha outro nome.`
          )
        );
        process.exit(1);
      }

      const spinner = ora(chalk.blue("Configurando seu projeto...")).start();

      try {
        const generate = generators[framework];
        if (!generate) {
          throw new Error(`Framework "${framework}" não é suportado ainda.`);
        }

        await generate({
          projectName,
          projectPath,
          packageManager,
          architecture: answers.architecture,
          spinner,
        });

        spinner.succeed(
          chalk.green(`Projeto "${projectName}" criado com sucesso!`)
        );

        console.log(chalk.cyanBright("\n🚀 Próximos passos:"));
        console.log(chalk.white(`   cd ${projectName}`));
        console.log(chalk.white(`   ${packageManager} install`));
        console.log(chalk.white(`   ${packageManager} run dev`));
      } catch (err) {
        spinner.fail(chalk.red("Ocorreu um erro ao criar o projeto."));
        if (err instanceof Error) {
          console.error(err.message);
        } else {
          console.error(err);
        }
        process.exit(1);
      }
    });

  return command;
};
