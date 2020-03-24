module.exports = {
  normalizeBranch(branch) {
    if (typeof branch !== 'string') {
      throw new TypeError('branch should be a string');
    }
  
    return branch.toLowerCase().replace(/[^a-z0-9]/, '-');
  },

  deployedBranchesConfigMapName(name) {
    return `${name}-deployedbranches`;
  }
};
