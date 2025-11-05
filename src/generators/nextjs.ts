import shell from "shelljs";
import { GeneratorOptions } from "../types/index.js";
import { applyDopsterStandards } from "../utils/standards.js";
import { getPackageManagerCommand } from "../utils/package-manager.js";

export const generateNextJs = async (options: GeneratorOptions) => {
  const { projectName, projectPath, packageManager, spinner } = options;

  spinner.text = "Executando create-next-app (isso pode levar um minuto)...";
  const pmCommand = getPackageManagerCommand(packageManager);

  const command = `${pmCommand} create-next-app@latest ${projectName} --typescript --eslint --tailwind --app --src-dir --import-alias "@/*"`;

  if (shell.exec(command).code !== 0) {
    throw new Error("Falha ao executar create-next-app");
  }

  await applyDopsterStandards({ projectPath, packageManager, spinner });
};
