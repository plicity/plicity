const util = require('./util');
const oc = require('./oc');

module.exports = {
  updateDeployedBranches,
  getDeployedBranchesConfigMap,
};

async function updateDeployedBranches(name, mergeData) {
  const data = await getDeployedBranchesConfigMap(name);

  return await oc.apply_({
    kind: 'ConfigMap',
    apiVersion: 'v1',
    metadata: {name: util.deployedBranchesConfigMapName(name)},
    data: {
      ...data,
      ...mergeData
    }
  });
}

async function getDeployedBranchesConfigMap(name) {
  const configMapName = util.deployedBranchesConfigMapName(name);
  return await oc.getConfigData(configMapName);
}
