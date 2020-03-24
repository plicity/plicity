const path = require('path');
const pino = require('pino');
const truncate = require('cli-truncate');

const ROOT = path.normalize(`${__dirname}/..`);
const MAX_NAME_LENGTH = 16;


/** @type {pino.PrettyOptions | boolean} */
const prettyPrint = process.env.PLICITY_LOG_PRETTY !== 'true' ? false : {
  ignore: 'pid,hostname,time'
};

module.exports = (filename, level = process.env.PLICITY_LOG_LEVEL || 'info') => {
  let name = path.relative(ROOT, filename);

  if (prettyPrint) {
    name = truncate(name, MAX_NAME_LENGTH, {position: 'start'}).padStart(MAX_NAME_LENGTH, ' ');
  }

  const logger = pino({name, level, prettyPrint});
  return logger;
};
