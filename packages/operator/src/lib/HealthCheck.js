const {createGitlab} = require('./gitlab');
const oc = require('./openshift/oc');

module.exports = class HealthCheck {
  async checkGitlab({gitlabHost, gitlabToken, gitlabProjectId}) {
    await require('./wait')(5000);
    const gitlab = createGitlab(gitlabHost, gitlabToken);
    await gitlab.Projects.show(gitlabProjectId);
  }

  async checkOpenShift({openshiftUrl, openshiftToken, openshiftProject, name} = {}) {
    await require('./wait')(5000);
    await oc.login(openshiftUrl, openshiftToken);
    await oc.project(openshiftProject);

    const config = await oc.getConfigData(`${name}-config`);
    if (config.name !== name) {
      throw new Error(`"${name}" seems not to be initialized`);
    }
  }
};