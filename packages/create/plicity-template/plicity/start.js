require('dotenv').config();

const plicity = require('@plicity/operator');
const logger = plicity.createLogger(__filename);

const operator = new plicity.openshift.Operator();

operator.start({
  onCreateBranch: setup,
  onChangeBranchHead: startBuild,
  onDeleteBranch: deleteAll,
  onServerBuild: startBuild
}).catch(e => console.error(e));

async function setup(event) {
  logger.trace('setup: %o', event);
  
  await plicity.openshift.oc.project(event.args.openshiftProject);
  await plicity.openshift.oc.applyTemplate(`${__dirname}/setup.yml`, {
    GITLAB_REPOSITORY_URL: event.gitlabRepositoryUrl,
    BRANCH_NAME_NORMALIZED: event.branchNormalized,
    NAME: event.args.name
  });
}

async function startBuild(event) {
  logger.trace('startBuild: %o', event);

  await plicity.openshift.oc.project(event.args.openshiftProject);
  await plicity.openshift.oc.startBuild(`${event.args.name}-${event.branchNormalized}`, {commit: event.commit});
}

async function deleteAll(event) {
  await plicity.openshift.oc.deleteAll(`app.plicity.io/branch=${event.args.name}-${event.branchNormalized}`);
}
