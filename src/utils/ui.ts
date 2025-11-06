import chalk from "chalk";
import figlet from "figlet";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const getCliVersion = (): string => {
  try {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const pkgPath = path.resolve(__dirname, "../../package.json");
    const pkgJson = JSON.parse(fs.readFileSync(pkgPath, "utf-8"));
    return pkgJson.version ?? "1.0.0";
  } catch {
    return "1.0.0";
  }
};

const colors = {
  primary: chalk.hex("#7C3AED").bold,
  secondary: chalk.hex("#A78BFA"),
  accent: chalk.hex("#EDE9FE").bold,
  muted: chalk.hex("#9CA3AF"),
  gradient: (text: string) =>
    chalk.hex("#7C3AED")(text.slice(0, text.length / 2)) +
    chalk.hex("#A78BFA")(text.slice(text.length / 2)),
};

const renderBannerText = (text: string): string => {
  const banner = figlet.textSync(text, {
    font: "ANSI Shadow",
    horizontalLayout: "default",
    verticalLayout: "default",
  });
  return colors.primary(banner);
};

export const showBanner = (): void => {
  console.clear();

  const version = getCliVersion();

  console.log(colors.gradient(renderBannerText("DOPSTER CLI")));

  console.log(colors.muted("──────────────────────────────────────────────"));

  const welcome = colors.accent(
    "⚡ Bem-vindo à CLI de padronização da Dopster"
  );
  const versionText = colors.muted(`v${version}`);
  console.log(` ${welcome}  ${versionText}`);

  console.log(
    colors.muted("\n Docs: https://docs.dopster.io/  |  © Dopster 2025")
  );
  console.log(colors.muted("──────────────────────────────────────────────\n"));
};
