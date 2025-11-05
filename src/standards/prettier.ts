// src/standards/prettier.ts
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

interface ApplyPrettierOptions {
  packageManager: PackageManager;
  spinner: Ora;
}

export const applyPrettier = async (options: ApplyPrettierOptions) => {
  const { packageManager, spinner } = options;
  const projectRoot = getProjectRoot();

  spinner.text = "Configurando Prettier...";

  const templatePath = getCommonTemplatePath();
  await fs.copy(
    path.join(templatePath, ".prettierrc.json"),
    path.join(projectRoot, ".prettierrc.json"),
    { overwrite: true }
  );

  const installCmd = getPackageManagerInstallCommand(packageManager, true);
  const deps = ["prettier", "prettier-config-dopster"];
  if (shell.exec(`${installCmd} ${deps.join(" ")}`).code !== 0) {
    throw new Error("Falha ao instalar dependências do Prettier.");
  }

  await addScripts({
    format: 'prettier --write "**/*.{ts,tsx,md,json}"',
  });
};
