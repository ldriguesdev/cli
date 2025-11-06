import type { Ora } from "ora";
import type { PackageManager } from "../utils/package-manager.js";

export type Framework = "Next.js" | "React.js" | "Node.js" | "Nest.js";

export type Architecture =
  | "Clean Architecture"
  | "Hexagonal"
  | "MVC";

export interface ProjectOptions {
  framework: Framework;
  projectName?: string;
  packageManager: PackageManager;
  architecture: Architecture;
}

export interface GeneratorOptions {
  projectName: string;
  projectPath: string;
  packageManager: PackageManager;
  spinner: Ora;
  architecture: Architecture;
}
