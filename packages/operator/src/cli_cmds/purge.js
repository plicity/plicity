const yargs = require('yargs');
const openshift = require('../lib/openshift');
const wrap = require('../lib/async-wrap');
const {wellKnown} = require('./lib/builder');
const {createGitlab} = require('../lib/gitlab');

/** @type {yargs.CommandModule} */
const mod = {
  command: 'purge',
  describe: 'purge plicity',
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
    await openshift.oc.login(openshiftUrl, openshiftToken);
    await openshift.oc.project(openshiftProject);
    await openshift.oc.deleteAll(`app.plicity.io/name=${name}`, {
      rolebindings: true,
      serviceaccounts: true
    });

    const gitlab = createGitlab(gitlabHost, gitlabToken);

    const badges = await gitlab.ProjectBadges.all(gitlabProjectId);
    for (const badge of badges) {
      if (badge.name === 'plicity') {
        await gitlab.ProjectBadges.remove(gitlabProjectId, badge.id);
      }
    }
  })
};

module.exports = mod;
