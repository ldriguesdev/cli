import { Command } from "commander";
import chalk from "chalk";
import inquirer from "inquirer";
import ora from "ora";
import path from "path";
import fs from "fs";
import shell from "shelljs";

type Framework = "Next.js" | "React.js" | "Node.js" | "Nest.js";
type PackageManager = "npm" | "yarn" | "pnpm";

interface ProjectOptions {
  framework: Framework;
  projectName?: string;
  packageManager: PackageManager;
}

const getPackageManagerCommand = (packageManager: PackageManager): string => {
  if (packageManager === "pnpm") return "pnpm dlx";
  if (packageManager === "yarn") return "yarn create";
  return "npx";
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
        console.log(
          chalk.red(
            "Erro: O nome do projeto não foi fornecido. Tente novamente."
          )
        );
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

      const spinner = ora("Gerando projeto...").start();
      const pmCommand = getPackageManagerCommand(packageManager);

      try {
        switch (framework) {
          case "Next.js":
            spinner.text = "Criando projeto Next.js com TypeScript...";
            shell.exec(
              `${pmCommand} create-next-app@latest ${projectName} --typescript --eslint --app`
            );
            break;

          case "Node.js":
            spinner.text = "Criando projeto Node.js com TypeScript...";
            fs.mkdirSync(projectPath);
            fs.mkdirSync(path.join(projectPath, "src"));
            shell.cd(projectPath);
            shell.exec(`${packageManager} install`);
            break;

          default:
            spinner.fail(`❌ Framework "${framework}" não é suportado ainda.`);
            process.exit(1);
        }

        spinner.succeed(`✅ Projeto "${projectName}" criado com sucesso!`);
      } catch (err) {
        spinner.fail("Ocorreu um erro ao criar o projeto.");

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
