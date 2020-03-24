const yargs = require('yargs');
const openshift = require('../lib/openshift');
const wrap = require('../lib/async-wrap');
const {createGitlab} = require('../lib/gitlab');
const {wellKnown} = require('./lib/builder');;

/** @type {yargs.CommandModule} */
const mod = {
  command: 'init',
  describe: 'initialize project',
  builder: {
    ...wellKnown.name(true),
    ...wellKnown.gitlabHost(true),
    ...wellKnown.gitlabToken(true),
    ...wellKnown.gitlabProjectId(true),
    ...wellKnown.openshiftProject(true),
    ...wellKnown.openshiftUrl(true),
    ...wellKnown.openshiftToken(true),
    ...wellKnown.dockerfileDir(true),
  },
  handler: wrap(async ({dockerfileDir, name, openshiftUrl, openshiftToken, openshiftProject, gitlabProjectId, gitlabHost, gitlabToken}) => {
    await openshift.oc.login(openshiftUrl, openshiftToken);
    await openshift.oc.project(openshiftProject);

    const gitlab = createGitlab(gitlabHost, gitlabToken);
    const project = await gitlab.Projects.show(gitlabProjectId);

    await openshift.oc.applyTemplate(`${__dirname}/../../setup.yml`, {
      GITLAB_REPOSITORY_URL: project['http_url_to_repo'],
      GITLAB_PROJECT_ID: gitlabProjectId,
      GITLAB_HOST: gitlabHost,
      GITLAB_TOKEN: gitlabToken,
      DOCKERFILE_DIR: dockerfileDir,
      NAME: name,
    });

    const host = await openshift.oc.get('route', name, {template: '{{.spec.host}}'});
    const {version} = require('../../package.json');

    await gitlab.ProjectBadges.add(gitlabProjectId, {
      name: 'plicity',
      link_url: `https://${host}`,
      image_url: `https://img.shields.io/badge/plicity-${version}-%23b8007d`
    });
  })
};

module.exports = mod;