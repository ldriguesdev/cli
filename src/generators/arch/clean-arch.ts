import fs from "fs";
import path from "path";
import type { Ora } from "ora";

interface Options {
  projectPath: string;
  spinner: Ora;
}

export const generateNestCleanArch = async ({
  projectPath,
  spinner,
}: Options) => {
  spinner.text = "Gerando estrutura Clean Architecture...";

  const srcPath = path.join(projectPath, "src");

  const folders = [
    "core/entities",
    "core/use-cases",
    "infrastructure/adapters",
    "infrastructure/database",
    "interfaces/http/controllers",
    "interfaces/http/dto",
  ];

  for (const folder of folders) {
    fs.mkdirSync(path.join(srcPath, folder), { recursive: true });
  }

  fs.writeFileSync(
    path.join(srcPath, "core/entities/user.entity.ts"),
    `export class User {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly email: string
  ) {}
}`
  );

  fs.writeFileSync(
    path.join(srcPath, "core/use-cases/create-user.usecase.ts"),
    `import { User } from "../entities/user.entity";

export class CreateUserUseCase {
  execute(data: { id: string; name: string; email: string }): User {
    return new User(data.id, data.name, data.email);
  }
}`
  );

  spinner.succeed("Clean Architecture aplicada com sucesso!");
};
