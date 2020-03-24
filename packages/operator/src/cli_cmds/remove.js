const yargs = require('yargs');
const openshift = require('../lib/openshift');
const wrap = require('../lib/async-wrap');
const {wellKnown} = require('./lib/builder');

/** @type {yargs.CommandModule} */
const mod = {
  command: 'remove [branch]',
  describe: 'remove setup',
  builder: {
    ...wellKnown.name(true),
    ...wellKnown.openshiftProject(true),
    ...wellKnown.openshiftUrl(true),
    ...wellKnown.openshiftToken(true),
  },
  handler: wrap(async ({name, openshiftProject, openshiftUrl, openshiftToken, branch}) => {
    await openshift.oc.login(openshiftUrl, openshiftToken);
    await openshift.oc.project(openshiftProject);
    await Promise.all([
      openshift.oc.deleteAll(`app.plicity.io/branch=${name}-${openshift.util.normalizeBranch(branch)}`),
      openshift.ops.updateDeployedBranches(name, {[branch]: null})
    ]);
  })
};

module.exports = mod;
