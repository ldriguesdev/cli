// src/utils/project.ts
import path from "path";
import fs from "fs-extra";
import type { PackageManager } from "./package-manager.js";
export const getProjectRoot = () => process.cwd();

export const getPackageJsonPath = () =>
  path.join(getProjectRoot(), "package.json");

export const readPackageJson = async () => {
  const pkgPath = getPackageJsonPath();
  if (!fs.existsSync(pkgPath)) {
    throw new Error("package.json não encontrado no diretório atual.");
  }
  return fs.readJson(pkgPath);
};

export const writePackageJson = async (pkg: any) => {
  await fs.writeJson(getPackageJsonPath(), pkg, { spaces: 2 });
};

export const addScripts = async (scripts: Record<string, string>) => {
  const pkg = await readPackageJson();
  pkg.scripts = { ...pkg.scripts, ...scripts };
  await writePackageJson(pkg);
};

export const detectPackageManager = (): PackageManager => {
  const root = getProjectRoot();
  if (fs.existsSync(path.join(root, "pnpm-lock.yaml"))) return "pnpm";
  if (fs.existsSync(path.join(root, "yarn.lock"))) return "yarn";
  return "npm";
};
