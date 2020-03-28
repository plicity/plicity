const RepositoryWatcher = require('./RepositoryWatcher');
const {normalizeBranch} = require('./util');
const {Server} = require('../http');
const logger = require('../log')(__filename);
const wait = require('../wait');
const {createGitlab} = require('../gitlab');

module.exports = class Operator {
  constructor(args = {}) {
    this._args = {
      ...require('../yargs').argv,
      ...args
    };

    this._repoWatcher = new RepositoryWatcher(this._args);
    this._server = new Server(this._args.port);
  }

  // opts
  async start({
    onCreateBranch = undefined,
    onChangeBranchHead = undefined,
    onDeleteBranch = undefined,
    onServerBuild = undefined,
  }) {
    await this._repoWatcher.initialize();
    await this._server.start({
      noUi: this._args.noUi,
      onServerBuild: async branch => {
        await onServerBuild({
          branch,
          branchNormalized: normalizeBranch(branch),
          args: this._args
        });
      },
      name: this._args.name,
      gitlab: createGitlab(this._args.gitlabHost, this._args.gitlabToken)
    });

    const updateOpts = {
      onCreateBranch: wrapCb(onCreateBranch, this._args),
      onChangeBranchHead: wrapCb(onChangeBranchHead, this._args),
      onDeleteBranch: wrapCb(onDeleteBranch, this._args),
    };

    try {
      while (true) {
        await this._repoWatcher.update(updateOpts);

        logger.debug('wait 10s');
        await wait(10000);
      }
    } finally {
      await this._server.stop();
    }
  }
};

function wrapCb(cb, args) {
  if (!cb) {
    return () => {};
  }

  return async event => {
    await cb({
      ...event,
      args
    });
  };
}
