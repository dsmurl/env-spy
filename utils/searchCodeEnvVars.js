const fs = require("fs");
const path = require("path");
const dotenv = require("dotenv");

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

const printLine = (line, color, spaces = 0) => {
  const COLORS = {
    black: "\x1b[30m",
    red: "\x1b[31m",
    green: "\x1b[32m",
    yellow: "\x1b[33m",
    blue: "\x1b[34m",
    magenta: "\x1b[35m",
    cyan: "\x1b[36m",
    white: "\x1b[37m",
  };
  console.log(
    `${new Array(spaces + 1).join(" ")}\x1b[1m${
      COLORS[color] || COLORS["green"]
    }%s\x1b[0m`,
    line
  );
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
        printLine(`${filePath}:`, "red", 6);
        printLine(Array.from(missingEnvVar).join(", "), "red", 8);
      }
    }
  });
};

const listEnvVars = () => {
  printLine(
    `Env vars in code, but missing in .env (starting at "./"):`,
    "red",
    4
  );
  _listEnvVars(".");
};

module.exports = {
  listEnvVars,
};
