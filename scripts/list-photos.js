#!/usr/bin/env node
const fs = require("fs");

const files = fs.readdirSync(".");

const result = files
  .map((fn) => `<photo>${fn.split(".")[0]}</photo>`)
  .join("\n");

console.debug(result);
