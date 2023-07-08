const COLORS = {
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
  cyan: "\x1b[36m",
  black: "\x1b[30m",
  white: "\x1b[37m",
  gray: "\x1b[90m",

  BgBlack: "\x1b[40m",
  BgRed: "\x1b[41m",
  BgGreen: "\x1b[42m",
  BgYellow: "\x1b[43m",
  BgBlue: "\x1b[44m",
  BgMagenta: "\x1b[45m",
  BgCyan: "\x1b[46m",
  BgWhite: "\x1b[47m",
  BgGray: "\x1b[100m",

  Reset: "\x1b[0m",
  Bright: "\x1b[1m",
  Dim: "\x1b[2m",
  Underscore: "\x1b[4m",
  Blink: "\x1b[5m",
  Reverse: "\x1b[7m",
  Hidden: "\x1b[8m",
};

const printLine = (line, color, spaces = 0) => {
  console.log(
    `${new Array(spaces + 1).join(" ")}\x1b[1m${
      COLORS[color] || color || COLORS.green
    }%s\x1b[0m`,
    line
  );
};

const colorPalette = () => {
  printLine(" Color Palette: ", "green", 0);

  Object.keys(COLORS).forEach((colorKey) => {
    process.stdout.write("  + ");
    printLine(`${colorKey}`, COLORS[colorKey], 0);
  });
  printLine("", COLORS.green, 0);
};

module.exports = {
  COLORS,
  printLine,
  colorPalette,
};
