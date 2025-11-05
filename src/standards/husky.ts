// src/standards/husky.ts
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

interface ApplyHuskyOptions {
  packageManager: PackageManager;
  spinner: Ora;
}

export const applyHusky = async (options: ApplyHuskyOptions) => {
  const { packageManager, spinner } = options;
  const projectRoot = getProjectRoot();

  spinner.text = "Configurando Husky + lint-staged...";

  const templatePath = getCommonTemplatePath();
  await fs.copy(
    path.join(templatePath, ".husky"),
    path.join(projectRoot, ".husky"),
    { overwrite: true }
  );

  await fs.copy(
    path.join(templatePath, "lint-staged.config.js"),
    path.join(projectRoot, "lint-staged.config.js"),
    { overwrite: true }
  );

  const installCmd = getPackageManagerInstallCommand(packageManager, true);
  const deps = ["husky", "lint-staged"];
  if (shell.exec(`${installCmd} ${deps.join(" ")}`).code !== 0) {
    throw new Error("Falha ao instalar dependências do Husky.");
  }

  await addScripts({ prepare: "husky install" });

  spinner.text = "Ativando hooks do Git...";
  if (shell.exec("npx husky install").code !== 0) {
    spinner.warn(
      'Falha ao executar "npx husky install". Talvez precise rodar manualmente.'
    );
  }
};
