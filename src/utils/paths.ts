// src/utils/paths.ts
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const cliRoot = path.join(__dirname, "..", "..");

export const getCommonTemplatePath = () => {
  return path.join(cliRoot, "templates", "_common");
};
