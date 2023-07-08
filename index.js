#!/usr/bin/env node

const dotenv = require("dotenv");
const fs = require("fs");
const { listEnvVars } = require("./utils/searchCodeEnvVars.js");
const { COLORS, printLine, colorPalette } = require("./utils/printUtils.js");

const testValueFromEnv = process.env.TEST_VALUE_FROM_ENV;

const ENV_FILE_NAME = ".env";
const ENV_EXAMPLE_FILE_NAME = `.env\.example`;

printLine(
  `Comparing ${ENV_FILE_NAME} and ${ENV_EXAMPLE_FILE_NAME}...`,
  COLORS.greend,
  2
);

if (!fs.existsSync(ENV_FILE_NAME)) {
  printLine(`Missing file ${ENV_FILE_NAME}`, COLORS.red, 4);
}

if (!fs.existsSync(ENV_EXAMPLE_FILE_NAME)) {
  printLine(`Missing file ${ENV_EXAMPLE_FILE_NAME}`, COLORS.red, 4);
}

if (fs.existsSync(ENV_FILE_NAME) && fs.existsSync(ENV_EXAMPLE_FILE_NAME)) {
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
    COLORS.yellow,
    4
  );
  Object.keys(missing).forEach((key) => {
    printLine(`${key} = ${missing[key]}`, COLORS.yellow, 6);
  });

  printLine(
    `Extra in ${ENV_FILE_NAME} (not in ${ENV_EXAMPLE_FILE_NAME}): `,
    COLORS.cyan,
    4
  );
  Object.keys(env).forEach((key) => {
    printLine(`${key} = ${env[key]}`, COLORS.cyan, 6);
  });
}

if (fs.existsSync(ENV_FILE_NAME)) {
  listEnvVars();
}

printLine(`...Done`, COLORS.green, 2);
