import shell from "shelljs";
import { GeneratorOptions } from "../types/index.js";
import { applyDopsterStandards } from "../utils/standards.js";
import { generateNestCleanArch } from "./arch/clean-arch.js";
import { generateNestHexagonal } from "./arch/hexagonal.js";
import path from "path";

export const generateNestJs = async (options: GeneratorOptions) => {
  const { projectName, projectPath, packageManager, spinner, architecture } =
    options;

  spinner.text = "Executando Nest CLI...";

  const command = `npx @nestjs/cli new ${projectName} --package-manager ${packageManager} --skip-git --strict`;

  const result = shell.exec(command);
  if (result.code !== 0) {
    throw new Error("Falha ao executar Nest CLI");
  }

  const nestProjectPath = path.join(process.cwd(), projectName);

  spinner.text = `Aplicando padrões Dopster (${architecture})...`;
  await applyDopsterStandards({ projectPath: nestProjectPath, packageManager, spinner });

  spinner.text = `Aplicando estrutura ${architecture}...`;

  switch (architecture) {
    case "Clean Architecture":
      await generateNestCleanArch({ projectPath, spinner });
      break;

    case "Hexagonal":
      await generateNestHexagonal({ projectPath, spinner });
      break;

    default:
      spinner.warn(
        `Arquitetura "${architecture}" não reconhecida. Nenhuma estrutura adicional aplicada.`
      );
  }

  spinner.succeed(`Projeto Nest.js (${architecture}) criado com sucesso!`);
};
