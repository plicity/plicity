const yargs = require('yargs');
const openshift = require('../lib/openshift');
const wrap = require('../lib/async-wrap');
const {wellKnown} = require('./lib/builder');

/** @type {yargs.CommandModule} */
const mod = {
  command: 'oc-login',
  describe: 'login via oc client',
  builder: {
    ...wellKnown.openshiftUrl(true),
    ...wellKnown.openshiftToken(true),
  },
  handler: wrap(async ({openshiftUrl, openshiftToken}) => {
    await openshift.oc.login(openshiftUrl, openshiftToken);
  })
};

module.exports = mod;
