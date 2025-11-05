// src/standards/eslint.ts
import ora, { type Ora } from "ora";
import shell from "shelljs";
import path from "path";
import fs from "fs-extra";
import { addScripts, getProjectRoot } from "../utils/project.js";
import { getCommonTemplatePath } from "../utils/paths.js";
import {
  getPackageManagerInstallCommand,
  type PackageManager,
} from "../utils/package-manager.js";

interface ApplyEslintOptions {
  packageManager: PackageManager;
  spinner: Ora;
}

export const applyEslint = async (options: ApplyEslintOptions) => {
  const { packageManager, spinner } = options;
  const projectRoot = getProjectRoot();

  spinner.text = "Configurando ESLint...";

  const templatePath = getCommonTemplatePath();

  await fs.copy(
    path.join(templatePath, ".eslintrc.json"),
    path.join(projectRoot, ".eslintrc.json"),
    { overwrite: true }
  );

  await fs.copy(
    path.join(templatePath, ".eslintignore"),
    path.join(projectRoot, ".eslintignore"),
    { overwrite: true }
  );

  const installCmd = getPackageManagerInstallCommand(packageManager, true);
  const deps = ["eslint", "eslint-config-dopster"];

  if (shell.exec(`${installCmd} ${deps.join(" ")}`).code !== 0) {
    throw new Error("Falha ao instalar dependências do ESLint.");
  }

  await addScripts({
    lint: "eslint . --ext .ts,.tsx --fix",
  });
};
