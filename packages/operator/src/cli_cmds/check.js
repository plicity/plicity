const yargs = require('yargs');
const wrap = require('../lib/async-wrap');
const {wellKnown} = require('./lib/builder');
const Listr = require('listr');
const HealthCheck = require('../lib/HealthCheck');
const {verrWrap} = require('../lib/error');

/** @type {yargs.CommandModule} */
const mod = {
  command: 'check',
  describe: 'check system',
  builder: {
    ...wellKnown.name(true),
    ...wellKnown.openshiftProject(true),
    ...wellKnown.openshiftUrl(true),
    ...wellKnown.openshiftToken(true),
    ...wellKnown.gitlabHost(true),
    ...wellKnown.gitlabToken(true),
    ...wellKnown.gitlabProjectId(true),
  },
  handler: wrap(async ({name, openshiftProject, openshiftUrl, openshiftToken, gitlabHost, gitlabToken, gitlabProjectId}) => {
    const health = new HealthCheck();

    const l = new Listr([
      {
        title: `check gitlab ${gitlabHost} with project id ${gitlabProjectId}`,
        task: () => verrWrap(health.checkGitlab({gitlabHost, gitlabToken, gitlabProjectId}), 'check gitlab')
      }, {
        title: `check openshift ${openshiftUrl} with project ${openshiftProject} and name ${name}`,
        task: () => verrWrap(health.checkOpenShift({openshiftUrl, openshiftToken, openshiftProject, name}), 'check openshift')
      }
    ], {concurrent: true});

    try {
      await l.run();
    } catch (e) {
      yargs.exit(1, e);
      return;
    }
  })
};

module.exports = mod;
