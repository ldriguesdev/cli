export type PackageManager = "npm" | "yarn" | "pnpm";

export const getPackageManagerCommand = (packageManager: PackageManager): string => {
  if (packageManager === "pnpm") return "pnpm dlx";
  if (packageManager === "yarn") return "yarn create";
  return "npx";
};

export const getPackageManagerInstallCommand = (
  packageManager: PackageManager,
  isDev: boolean = false
): string => {
  const devFlag = isDev ? (packageManager === 'yarn' ? 'add -D' : 'install --save-dev') : 'install';
  if (isDev) {
    if (packageManager === 'yarn') return 'yarn add -D';
    if (packageManager === 'pnpm') return 'pnpm add -D';
    return 'npm install --save-dev';
  }
  
  if (packageManager === 'yarn') return 'yarn add';
  if (packageManager === 'pnpm') return 'pnpm add';
  return 'npm install';
}