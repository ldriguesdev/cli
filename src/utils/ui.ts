import chalk from "chalk";
import figlet from "figlet";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const getCliVersion = (): string => {
  try {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    const pkgPath = path.join(__dirname, "..", "..", "package.json");

    const pkgJson = JSON.parse(fs.readFileSync(pkgPath, "utf-8"));
    return pkgJson.version || "1.0.0";
  } catch (e) {
    return "1.0.0";
  }
};

const brandColor = chalk.hex("#030896").bold;
const highlightColor = chalk.white.bold;
const mutedColor = chalk.gray;

const cliVersion = getCliVersion();

export const showBanner = () => {
  console.clear();
  const text = figlet.textSync("DOPSTER CLI", {
    font: "Standard",
    horizontalLayout: "default",
    verticalLayout: "default",
  });

  console.log(brandColor(text));

  const welcomeMessage = "   Bem-vindo à CLI de padronização da Dopster!";
  const versionString = `(v${cliVersion})`;

  console.log(`${highlightColor(welcomeMessage)} ${mutedColor(versionString)}`);

  console.log("");
};
