
const DEFAULT_DOCKERFILE_DIR = 'plicity';

module.exports = {
  wellKnown: {
    name:                       demandOption => ({name: {demandOption}}),
    openshiftProject:           demandOption => ({openshiftProject: {demandOption}}),
    openshiftUrl:               demandOption => ({openshiftUrl: {demandOption}}),
    openshiftToken:             demandOption => ({openshiftToken: {demandOption}}),
    gitlabProjectId:            demandOption => ({gitlabProjectId: {demandOption}}),
    gitlabHost:                 demandOption => ({gitlabHost: {demandOption}}),
    gitlabToken:                demandOption => ({gitlabToken: {demandOption}}),
    logLevel:                   () => ({logLevel: {default: 'info'}}),
    port:                       demandOption => ({port: {demandOption}}),
    useUiProxy:                 () => ({useUiProxy: {}}),
    dockerfileDir:              demandOption => ({dockerfileDir: {demandOption, default: DEFAULT_DOCKERFILE_DIR}}),
  }
};
