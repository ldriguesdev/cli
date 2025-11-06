import { GeneratorOptions } from "../types/index.js";
import { applyPrettier } from "../standards/prettier.js";
import { applyHusky } from "../standards/husky.js";
import { applyEslint } from "../standards/eslint.js";
import shell from "shelljs";

type StandardOptions = Pick<
  GeneratorOptions,
  "projectPath" | "packageManager" | "spinner"
>;

export const applyDopsterStandards = async (options: StandardOptions) => {
  const { projectPath, packageManager, spinner } = options;

  const originalCwd = process.cwd();
  shell.cd(projectPath);

  const standardOptions = { packageManager, spinner };

  try {
    // await applyPrettier(standardOptions);
    await applyHusky(standardOptions);
    // await applyEslint(standardOptions);
  } catch (error) {
    shell.cd(originalCwd);
    throw error;
  }

  shell.cd(originalCwd);
};
