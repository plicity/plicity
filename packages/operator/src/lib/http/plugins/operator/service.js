const fastify = require('fastify');
const ms = require('ms');
const ops = require('../../../openshift/ops');
const oc = require('../../../openshift/oc');
const {Gitlab} = require('gitlab');
const {version: plicityVersion} = require('../../../../../package.json');

module.exports = createService;

/**
 * @param {{name: string, onServerBuild: Function, gitlab: InstanceType<typeof Gitlab>}} param0 
 */
function createService({name, onServerBuild, gitlab}) {
  return {
    /**
     * @param {fastify.FastifyRequest} _ 
     * @param {fastify.FastifyReply} reply 
     */
    async getBranches(_, reply) {
      const x = await ops.getDeployedBranchesConfigMap(name);
      const deployedBranches = [];
      for (const [name, commit] of Object.entries(x)) {
        deployedBranches.push({name, commit});
      }

      reply.send(deployedBranches);
    },

    /**
     * @param {fastify.FastifyRequest} req 
     * @param {fastify.FastifyReply} reply 
     */
    async buildBranch(req, reply) {
      const {branch} = req.params;
      const start = process.hrtime.bigint();
      await onServerBuild(branch);
      const millis = Number(process.hrtime.bigint() - start) / 1000000;
      
      reply.send({
        message: `build took ${ms(millis)}`,
        millis
      });
    },

    /**
     * @param {fastify.FastifyRequest} _ 
     * @param {fastify.FastifyReply} reply 
     */
    async buildOperator(_, reply) {
      const start = process.hrtime.bigint();
      await oc.startBuild(name);
      const millis = Number(process.hrtime.bigint() - start) / 1000000;
      
      reply.send({
        message: `build took ${ms(millis)}`,
        millis
      });
    },

    /**
     * @param {fastify.FastifyRequest} _ 
     * @param {fastify.FastifyReply} reply 
     */
    async getConfig(_, reply) {
      const [gitlabVersion, ocVersion] = await Promise.all([
        gitlab.Version.show(),
        oc.version()
      ]);

      reply.send({
        operator: {
          name: 'PLICITY',
          type: 'plicity',
          version: plicityVersion
        },
        repository: {
          name: 'Gitlab',
          type: 'gitlab',
          version: `${gitlabVersion.version}@${gitlabVersion.revision}`
        },
        cloud: {
          name: 'OpenShift',
          type: 'openshift',
          version: ocVersion
        }
      });
    }
  };
};
