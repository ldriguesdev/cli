import fs from "fs";
import path from "path";
import type { Ora } from "ora";

interface Options {
  projectPath: string;
  spinner: Ora;
}

export const generateNestHexagonal = async ({
  projectPath,
  spinner,
}: Options) => {
  spinner.text = "Gerando estrutura Hexagonal...";

  const srcPath = path.join(projectPath, "src");

  const folders = [
    "application/services",
    "application/ports/in",
    "application/ports/out",
    "domain/models",
    "domain/repositories",
    "infrastructure/adapters",
  ];

  for (const folder of folders) {
    fs.mkdirSync(path.join(srcPath, folder), { recursive: true });
  }

  fs.writeFileSync(
    path.join(srcPath, "domain/models/user.model.ts"),
    `export class User {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly email: string
  ) {}
}`
  );

  fs.writeFileSync(
    path.join(srcPath, "application/services/create-user.service.ts"),
    `import { User } from "../../domain/models/user.model";

export class CreateUserService {
  execute(data: { id: string; name: string; email: string }): User {
    return new User(data.id, data.name, data.email);
  }
}`
  );

  spinner.succeed("Arquitetura Hexagonal aplicada com sucesso!");
};
