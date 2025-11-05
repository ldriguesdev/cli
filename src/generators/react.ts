import shell from "shelljs";
import { GeneratorOptions } from "../types/index.js";
import { applyDopsterStandards } from "../utils/standards.js";
import { getPackageManagerCommand } from "../utils/package-manager.js";

export const generateReact = async (options: GeneratorOptions) => {
  const { projectName, projectPath, packageManager, spinner } = options;

  spinner.text = "Executando create-vite (React + TS)...";
  const pmCommand = getPackageManagerCommand(packageManager);

  const command = `${pmCommand} create-vite@latest ${projectName} --template react-ts`;

  if (shell.exec(command).code !== 0) {
    throw new Error("Falha ao executar create-vite");
  }

  spinner.text = "Instalando dependências do Vite...";
  shell.cd(projectPath);
  if (shell.exec(`${packageManager} install`).code !== 0) {
    throw new Error("Falha ao instalar dependências do Vite");
  }

  await applyDopsterStandards({ projectPath, packageManager, spinner });
};
