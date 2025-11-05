import shell from "shelljs";
import { GeneratorOptions } from "../types/index.js";
import { applyDopsterStandards } from "../utils/standards.js";

export const generateNestJs = async (options: GeneratorOptions) => {
  const { projectName, projectPath, packageManager, spinner } = options;

  spinner.text = "Executando Nest CLI...";

  const command = `npx @nestjs/cli new ${projectName} --package-manager ${packageManager} --skip-git --strict`;

  if (shell.exec(command).code !== 0) {
    throw new Error("Falha ao executar Nest CLI");
  }

  await applyDopsterStandards({ projectPath, packageManager, spinner });
};
