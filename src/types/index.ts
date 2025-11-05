import type { Ora } from "ora";
import type { PackageManager } from "../utils/package-manager.js";

export type Framework = "Next.js" | "React.js" | "Node.js" | "Nest.js";

export interface ProjectOptions {
  framework: Framework;
  projectName?: string;
  packageManager: PackageManager;
}

export interface GeneratorOptions {
  projectName: string;
  projectPath: string;
  packageManager: PackageManager;
  spinner: Ora;
}
