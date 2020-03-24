const yargs = require('yargs');
const openshift = require('../lib/openshift');
const wrap = require('../lib/async-wrap');
const {wellKnown} = require('./lib/builder');
const {createGitlab} = require('../lib/gitlab');
const Listr = require('listr');
const HealthCheck = require('../lib/HealthCheck');
const logger = require('../lib/log')(__filename);

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
        task: () => health.checkGitlab({gitlabHost, gitlabToken, gitlabProjectId})
      }, {
        title: `check openshift ${openshiftUrl} with project ${openshiftProject}`,
        task: () => health.checkOpenShift({openshiftUrl, openshiftToken, openshiftProject, name})
      }
    ], {concurrent: true});

    await l.run();
  })
};

module.exports = mod;
