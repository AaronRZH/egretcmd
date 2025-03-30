#!/usr/bin/env node
const lib = require("../lib");

const projectRoot = process.argv[3] || ".";
lib.runCommand(projectRoot);
