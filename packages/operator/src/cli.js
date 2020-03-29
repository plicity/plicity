#!/usr/bin/env node

process.env.PLICITY_LOG_PRETTY = 'true';

require('./lib/env');
const yargs = require('./lib/yargs');

yargs
  .commandDir('cli_cmds')
  .demandCommand()
  .help()
  .argv;
