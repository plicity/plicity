const fs = require('fs');
const path = require('path');
const {promisify} = require('util');
const fastify = require('fastify');
const openapiGlue = require('fastify-openapi-glue');
const fp = require('fastify-plugin');
const service = require('./service');

const OPENAPI_YAML = `${__dirname}/operator.v1.openapi.yaml`;

module.exports = fp(plugin, {name: 'operator'});

/**
 * @param {fastify.FastifyInstance} instance
 * @param {{onServerBuild: Function, name: string}} param1
 */
async function plugin(instance, {name, onServerBuild, gitlab}) {
  instance.register(fp(openapiGlue), {
    specification: OPENAPI_YAML,
    service: service({name, onServerBuild, gitlab}),
    noAdditional: true
  });

  const yamlContent = await promisify(fs.readFile)(OPENAPI_YAML);
  instance.get('/api/operator/v1', (req, reply) => {
    reply
      .type('application/yaml')
      .header('content-disposition', `attachment; filename="${path.basename(OPENAPI_YAML)}"`)
      .send(yamlContent);
  });
}
