const fs = require("fs");
const path = require("path");
const dotenv = require("dotenv");

const { COLORS, printLine } = require("./printUtils");

const skipFiles = ["node_modules"];
const fileTypes = [".ts", ".js", ".jsx", ".tsx"];

const getEnvVars = (file) => {
  const envVarRegExp = /\b(process\.)?env\.(\w+)\b/g;
  const content = fs.readFileSync(file, "utf-8");
  const envVars = [];
  let match;
  while ((match = envVarRegExp.exec(content))) {
    envVars.push(match[2]);
  }
  return envVars;
};

const _listEnvVars = (dir) => {
  const envKeys = Object.keys(dotenv.config({ path: ".env" }).parsed);
  fs.readdirSync(dir).forEach((file) => {
    if (skipFiles.includes(file)) {
      return;
    }
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      _listEnvVars(filePath);
    } else if (fileTypes.includes(path.extname(file))) {
      const envVars = getEnvVars(filePath);
      const missingEnvVar = envVars.filter((f) => !envKeys.includes(f));
      if (missingEnvVar.length > 0) {
        printLine(`${filePath}:`, COLORS.red, 6);
        printLine(Array.from(missingEnvVar).join(", "), COLORS.red, 8);
      }
    }
  });
};

const listEnvVars = () => {
  printLine(
    `Env vars in code, but missing in .env (starting at "./"):`,
    COLORS.red,
    4
  );
  _listEnvVars(".");
};

module.exports = {
  listEnvVars,
};
