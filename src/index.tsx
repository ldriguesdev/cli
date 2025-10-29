#!/usr/bin/env node

import chalk from "chalk";
import figlet from "figlet";
import gradient from "gradient-string";
import inquirer from "inquirer";
import ora from "ora";
import path from "path";
import fs from "fs";
import shell from "shelljs";

const showBanner = () => {
  console.clear();
  const text = figlet.textSync("DOPSTER CLI", {
    horizontalLayout: "default",
    verticalLayout: "default",
  });
  console.log(gradient.pastel.multiline(text));
  console.log(chalk.cyanBright("Welcome to Dopster CLI!"));
};

const app = async () => {
  showBanner();

  const { framework, projectName, packageManager } = await inquirer.prompt([
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
    },
    {
      type: "list",
      name: "packageManager",
      message: "Qual gerenciador de pacotes você deseja usar?",
      choices: ["npm", "yarn", "pnpm"],
      default: "npm",
    },
  ]);

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

  try {
    switch (framework) {
      case "Next.js":
        spinner.text = "Criando projeto Next.js com TypeScript...";
        shell.exec(
          `${
            packageManager === "pnpm"
              ? "pnpm dlx"
              : packageManager === "yarn"
              ? "yarn create"
              : "npx"
          } create-next-app@latest ${projectName} --typescript --eslint --app`
        );
        break;

      case "Nest.js":
        spinner.text = "Criando projeto NestJS com TypeScript...";
        shell.exec(
          `${
            packageManager === "pnpm"
              ? "pnpm dlx"
              : packageManager === "yarn"
              ? "yarn create"
              : "npx"
          } @nestjs/cli new ${projectName} --language ts`
        );
        break;

      case "React.js":
        spinner.text = "Criando projeto React com TypeScript...";
        shell.exec(
          `${
            packageManager === "pnpm"
              ? "pnpm dlx"
              : packageManager === "yarn"
              ? "yarn create"
              : "npx"
          } create-react-app ${projectName} --template typescript`
        );
        break;

      case "Node.js":
        spinner.text = "Criando projeto Node.js com TypeScript...";
        fs.mkdirSync(projectPath);
        fs.mkdirSync(path.join(projectPath, "src"));

        fs.writeFileSync(
          path.join(projectPath, "tsconfig.json"),
          JSON.stringify(
            {
              compilerOptions: {
                target: "ES2021",
                module: "commonjs",
                outDir: "dist",
                rootDir: "src",
                strict: true,
                esModuleInterop: true,
              },
              include: ["src/**/*"],
            },
            null,
            2
          )
        );

        // src/index.ts
        fs.writeFileSync(
          path.join(projectPath, "src", "index.ts"),
          `console.log("🚀 Servidor Node com TypeScript iniciado!");`
        );

        // package.json
        fs.writeFileSync(
          path.join(projectPath, "package.json"),
          JSON.stringify(
            {
              name: projectName,
              version: "1.0.0",
              main: "dist/index.js",
              scripts: {
                start: "node dist/index.js",
                build: "tsc",
                dev: "ts-node src/index.ts",
              },
              dependencies: {},
              devDependencies: {
                typescript: "^5.6.3",
                "ts-node": "^10.9.2",
                "@types/node": "^22.0.0",
              },
            },
            null,
            2
          )
        );

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
    console.error(err);
    process.exit(1);
  }
};

app();
