#!/usr/bin/env node

const dotenv = require("dotenv");
const fs = require("fs");
const { listEnvVars } = require("./utils/searchCodeEnvVars.js");

const testValueFromEnv = process.env.TEST_VALUE_FROM_ENV;

const ENV_FILE_NAME = ".env";
const ENV_EXAMPLE_FILE_NAME = `.env\.example`;
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

const printLine = (line, color, spaces = 0) => {
  console.log(
    `${new Array(spaces + 1).join(" ")}\x1b[1m${
      COLORS[color] || COLORS["green"]
    }%s\x1b[0m`,
    line
  );
};

try {
  if (!fs.existsSync(ENV_FILE_NAME) || !fs.existsSync(ENV_EXAMPLE_FILE_NAME)) {
    throw Error("Missing files");
  }
} catch (err) {
  printLine(
    ` - Couldn't find ${ENV_FILE_NAME} and ${ENV_EXAMPLE_FILE_NAME}!`,
    "red",
    2
  );
  process.exit(1);
}

printLine(
  `Comparing ${ENV_FILE_NAME} to ${ENV_EXAMPLE_FILE_NAME}...`,
  "green",
  2
);

const env = dotenv.config({ path: ENV_FILE_NAME }).parsed;
const envExample = dotenv.config({ path: ENV_EXAMPLE_FILE_NAME }).parsed;
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

printLine(
  `Missing from ${ENV_FILE_NAME} (noted in ${ENV_EXAMPLE_FILE_NAME}):`,
  "blue",
  4
);
Object.keys(missing).forEach((key) => {
  printLine(`${key} = ${missing[key]}`, "blue", 6);
});

printLine(
  `Extra in ${ENV_FILE_NAME} (not in ${ENV_EXAMPLE_FILE_NAME}): `,
  "cyan",
  4
);
Object.keys(env).forEach((key) => {
  printLine(`${key} = ${env[key]}`, "cyan", 6);
});

listEnvVars();

printLine(`...Done`, "green", 2);
