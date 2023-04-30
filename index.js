#!/usr/bin/env node

const dotenv = require("dotenv");
const fs = require("fs");

colors = {
  black: "\x1b[30m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
  cyan: "\x1b[36m",
  white: "\x1b[37m",
};

const printLine = (line, color) => {
  const targetColorCode = colors[color] || colors["green"];
  console.log(`\x1b[1m${targetColorCode}%s\x1b[0m`, line);
};

const myFiles = [".env", ".env.example"];

try {
  if (!fs.existsSync(myFiles[0]) || !fs.existsSync(myFiles[1])) {
    throw Error("Missing files");
  }
} catch (err) {
  printLine(" - Couldn't find .env and .env.example!", "red");
  process.exit(1);
}

printLine(` - Comparing .env with your .env.example: `, "green");

const env = dotenv.config({ path: myFiles[0] }).parsed;
// const envKeys = Object.keys(env);

const envExample = dotenv.config({ path: myFiles[1] }).parsed;
const envExampleKeys = Object.keys(envExample);

const missing = {};
const present = {};
envExampleKeys.forEach((exampleKey) => {
  if (!env[exampleKey]) {
    missing[exampleKey] = envExample[exampleKey];
    delete env[exampleKey];
  } else {
    present[exampleKey] = envExample[exampleKey];
    delete env[exampleKey];
  }
});

printLine("Missing (noted in .env.example): ", "red");
printLine(missing, "red");
printLine("Extra (not in .env.example): ", "cyan");
printLine(env, "cyan");
