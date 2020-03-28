const oc = require('./oc')
const {createGitlab} = require('../gitlab');
const logger = require('../log')(__filename);
const ops = require('./ops');
const util = require('./util');

module.exports = class RepositoryWatcher {
  
  constructor({gitlabHost, gitlabToken, gitlabProjectId, openshiftProject, openshiftUrl, openshiftToken, name}) {
    if (!gitlabHost) {
      throw new TypeError('gitlab host missing');
    }
    this._gitlabHost = gitlabHost;

    if (!gitlabToken) {
      throw new TypeError('gitlab token missing');
    }
    this._gitlabToken = gitlabToken;

    if (!gitlabProjectId) {
      throw new TypeError('gitlab project id missing');
    }
    this._gitlabProjectId = gitlabProjectId;

    if (!openshiftProject) {
      throw new TypeError('openshift project missing');
    }
    this._openshiftProject = openshiftProject;

    if (!name) {
      throw new TypeError('name missing');
    }
    this._name = name;

    this._openshiftUrl = openshiftUrl;
    this._openshiftToken = openshiftToken;
  }

  async initialize() {
    this._gitlab = createGitlab(this._gitlabHost, this._gitlabToken);
    this._gitlabRepositoryUrl = (await this._gitlab.Projects.show(this._gitlabProjectId)).http_url_to_repo;

    await oc.login(this._openshiftUrl, this._openshiftToken);
    await oc.project(this._openshiftProject);

    // check project initialized
    const {name} = await oc.getConfigData(`${this._name}-config`);
    if (name !== this._name) {
      throw new Error('project not seems to be initialized for plicity');
    }
  }

  async update({
    onCreateBranch,
    onChangeBranchHead,
    onDeleteBranch
  }) {
    logger.debug('update branches');
    const [sourceBranchesNormalized, deployedBranches] = await Promise.all([
      this._getNormalizedSourceBranches(),
      ops.getDeployedBranchesConfigMap(this._name)
    ]);

    // builds and updates
    logger.debug('find branches to build or update');
    for (const [branchNormalized, commit] of sourceBranchesNormalized.entries()) {
      const event = this._createHookEvent(branchNormalized, commit);

      if (!isBranchDeployed(deployedBranches, branchNormalized)) {
        logger.info('build branch %s: %s', branchNormalized, commit);
        if (onCreateBranch) {
          logger.debug('invoke hook onCreateBranch: %s: %s', branchNormalized, commit);
          await onCreateBranch(event);
        }
        await ops.updateDeployedBranches(this._name, {[branchNormalized]: commit});
        continue;
      }

      if (!isBranchHead(deployedBranches, branchNormalized, commit)) {
        logger.info('update branch %s: %s', branchNormalized, commit);
        if (onChangeBranchHead) {
          logger.debug('invoke hook onChangeBranchHead: %s: %s', branchNormalized, commit);
          await onChangeBranchHead(event);
        }
        await ops.updateDeployedBranches(this._name, {[branchNormalized]: commit});
        continue;
      }

      logger.debug('unchanged branch %s: %s', branchNormalized, commit);
    }

    // deletions
    logger.debug('find deleted branches');
    for (const [branchNormalized, commit] of Object.entries(deployedBranches)) {
      const event = this._createHookEvent(branchNormalized, commit);

      if (!sourceBranchesNormalized.has(branchNormalized)) {
        logger.info('deleted branch %s: %s', branchNormalized, commit);
        if (onDeleteBranch) {
          logger.debug('invoke hook onDeleteBranch: %s: %s', branchNormalized, commit);
          await onDeleteBranch(event);
        }

        await ops.updateDeployedBranches(this._name, {[branchNormalized]: null});
        continue;
      }
    }
  }

  async _getNormalizedSourceBranches() {
    logger.debug('get sources branches');
    const sourceBranches = await this._gitlab.Branches.all(this._gitlabProjectId);
    
    logger.debug('%d source branches found', sourceBranches.length);
    
    const branches = new Map();
    for (const {name, commit: {id}} of sourceBranches) {
      branches.set(util.normalizeBranch(name), id);
    }

    return branches;
  }


  _createHookEvent(branchNormalized, commit) {
    return {
      branch: branchNormalized, // TODO(prenoth)
      branchNormalized,
      commit,
      gitlabRepositoryUrl: this._gitlabRepositoryUrl
    };
  }
};



function isBranchDeployed(deployedBranches, branchNormalized) {
  return branchNormalized in deployedBranches;
}

function isBranchHead(deployedBranches, branchNormalized, commit) {
  return deployedBranches[branchNormalized] === commit;
}