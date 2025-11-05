import path from "path";
import fs from "fs-extra";
import shell from "shelljs";
import { fileURLToPath } from "url";
import { GeneratorOptions } from "../types/index.js";
import { applyDopsterStandards } from "../utils/standards.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const generateNodeJs = async (options: GeneratorOptions) => {
  const { projectName, projectPath, packageManager, spinner } = options;

  spinner.text = "Criando projeto Node.js com TypeScript...";

  const templatePath = path.resolve(
    __dirname,
    "..",
    "..",
    "templates",
    "nodejs"
  );

  if (!fs.existsSync(templatePath)) {
    throw new Error(
      `Diretório de template Node.js não encontrado em: ${templatePath}`
    );
  }

  await fs.copy(templatePath, projectPath);

  const pkgJsonPath = path.join(projectPath, "_package.json");
  const pkgJson = await fs.readJson(pkgJsonPath);

  pkgJson.name = projectName;

  await fs.writeJson(path.join(projectPath, "package.json"), pkgJson, {
    spaces: 2,
  });
  await fs.remove(pkgJsonPath);

  spinner.text = "Instalando dependências...";
  shell.cd(projectPath);
  if (shell.exec(`${packageManager} install`).code !== 0) {
    throw new Error("Falha ao instalar dependências");
  }

  await applyDopsterStandards({ projectPath, packageManager, spinner });
};
