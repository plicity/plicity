const {spawn} = require('child_process');
const os = require('os');
const path = require('path');
const stream = require('stream');
const fs = require('fs');
const util = require('util');
const logger = require('../log')(__filename);

const fsAccess = util.promisify(fs.access);
const fsLstat = util.promisify(fs.lstat);
const fsReadFile = util.promisify(fs.readFile);
const fsRealpath = util.promisify(fs.realpath);

const OC_BIN     = path.normalize(`${__dirname}/../../../oc`);
const KUBECONFIG = `${os.tmpdir()}/.kube/config`;

logger.info('using KUBECONFIG %s', KUBECONFIG);

const methods = {
  OC_BIN,
  async login(url, token) {
    if (!url) {
      return await this.loginViaServiceAccount()
    }

    return await this.loginViaToken(url, token);
  },
  async loginViaToken(url, token) {
    // oc/oc login $OC_URL --token=$OC_TOKEN --insecure-skip-tls-verify
    // TODO(prenoth): --insecure-skip-tls-verify sucks of course
    await oc('login', url, '--token', token, '--insecure-skip-tls-verify').promise;
  },
  async loginViaServiceAccount() {
    const sa = await getServiceAccount();

    if (!sa) {
      throw new Error('not seems to be a service account container');
    }

    await oc('login', sa.url,
      '--certificate-authority', sa.ca,
      '--token', sa.token
    ).promise;
  },
  async project(name) {
    if (!name) {
      throw new TypeError('missing project name');
    }

    await oc('project', name).promise;
  },
  async startBuild(name, {commit = undefined} = {}) {
    // oc/oc start-build shop --follow --wait
    const args = [];
    if (commit) {
      args.push('--commit');
      args.push(commit);
    }

    await oc('start-build', name, '--follow', '--wait', ...args).promise;
  },
  async applyTemplate(templatePath, parameters = {}) {
    const ocProcess = oc('process', '-f', templatePath, ...toTemplateArgs(parameters));
    const ocApply   = oc('apply', '-f', '-');

    pipe(ocProcess, ocApply);

    await Promise.all([ocProcess.promise, ocApply.promise]);
  },
  async deleteTemplate(templatePath, parameters = {}) {
    const ocProcess = oc('process', '-f', templatePath, ...toTemplateArgs(parameters));
    const ocDelete   = oc('delete', '-f', '-');

    pipe(ocProcess, ocDelete);

    await Promise.all([ocProcess.promise, ocDelete.promise]);
  },
  async get(type, name, {template = undefined, output = undefined}) {
    const args = [];
    if (template) {
      args.push('--template', template);
    }

    if (output) {
      args.push('-o', output);
    }

    const ocGet = oc('get', type, name, ...args);
    return await collectStdout(ocGet);
  },
  async describe(type, name) {
    await oc('describe', type, name).promise;
  },
  async deleteAll(selector, {all = true, secrets = true, configmaps = true, serviceaccounts = true, rolebindings = true} = {}) {
    const proms = [];
    if (all) {
      proms.push(oc('delete', 'all', '--selector', selector).promise);
    }

    if (secrets) {
      proms.push(oc('delete', 'secrets', '--selector', selector).promise);
    }

    if (configmaps) {
      proms.push(oc('delete', 'configmaps', '--selector', selector).promise);
    }

    if (serviceaccounts) {
      proms.push(oc('delete', 'sa', '--selector', selector).promise);
    }

    if (rolebindings) {
      proms.push(oc('delete', 'rolebindings', '--selector', selector).promise);
    }
    
    await Promise.all(proms);
  },
  async getSecretData(secret) {
    const json = await this.get('secret', secret, {output: 'json'});
    const {data} = JSON.parse(json);

    const stringData = {};
    for (const k of Object.keys(data)) {
      stringData[k] = Buffer.from(data[k], 'base64').toString();
    }

    return stringData;
  },
  async getConfigData(configMap) {
    const json = await this.get('configmap', configMap, {output: 'json'});
    const {data = {}} = JSON.parse(json);
    return data;
  },
  async apply_(object) {
    const ocApply = oc('apply', '-f', '-');
    const json = JSON.stringify(object);
    await new Promise(resolve => {
      ocApply.proc.stdin.end(json, () => resolve());
    });

    return ocApply.promise;
  },
  async version() {
    const ocVersion = oc('version');
    return await collectStdout(ocVersion);
  }
};

module.exports = Object.assign(oc, methods);

function oc(...args) {
  logger.trace('START: oc %s', args.join(' '));
  const proc = spawn(OC_BIN, args, {env: {
    KUBECONFIG
  }});

  collectStream(proc.stdout).then(out => {
    if (out) {
      logger.trace('oc STDOUT: %s', out);
    }
  });

  const bufs2 = [];
  collectStream(proc.stderr, bufs2);

  return {
    proc,
    promise: new Promise((resolve, reject) => {
      proc.once('close', (code, signal) => {
        
        if (code !== 0) {
          logger.error('ERROR executing OpenShift client\n$ oc %s\n=> code: %d, signal: %s\n=> %s', args.join(' '), code, signal, Buffer.concat(bufs2).toString());
          reject(new Error(`${OC_BIN} ${args.map(x => `"${x}"`).join(' ')}`));
          return;
        }

        logger.trace('END: oc %s', args.join(' '));
        resolve();
      });
    })
  };
}

/**
 * @param  {...{proc: {stdout, stdin}}} oc 
 */
function pipe(...oc) {
  const noopCallback = () => {};

  for (let i = 0; i < oc.length - 1; i++) {
    stream.pipeline(oc[i].proc.stdout, oc[i+1].proc.stdin, noopCallback);
  }
}

async function collectStdout(oc) {
  const bufs = [];
  oc.proc.stdout.on('data', data => {
    bufs.push(data);
  });

  await oc.promise;
  return Buffer.concat(bufs).toString();
}

async function collectStream(stream, bufs = []) {
  stream.on('data', onData);

  return await new Promise(resolve => {
    stream.once('close', () => {
      stream.off('data', onData);
      resolve(Buffer.concat(bufs).toString())
    });
  });
  
  function onData(data) {
    bufs.push(data);
  }
}

/**
 * 
 * @param {{[key: string]: string}} parameters 
 */
function toTemplateArgs(parameters) {
  const p = [];
  for (const key of Object.keys(parameters)) {
    const value = parameters[key];
    if (typeof value !== 'string' && typeof value !== 'number') {
      throw new TypeError(`only string or number is allowed for template parameters.`);
    }
    p.push('-p', `${key}=${value}`);
  }

  return p;
}

const SERVICEACCOUNT_DIR = '/var/run/secrets/kubernetes.io/serviceaccount'
const TOKEN_PATH = `${SERVICEACCOUNT_DIR}/token`;
const CA_PATH = `${SERVICEACCOUNT_DIR}/ca.crt`;

async function getServiceAccount() {
  if (!await hasServiceAccount()) {
    return;
  }

  return {
    url: 'kubernetes.default.svc',
    token: (await readFileSym(TOKEN_PATH)).toString(),
    ca: CA_PATH
  };
}

async function hasServiceAccount() {
  try {
    await fsAccess(SERVICEACCOUNT_DIR);
  } catch (e) {
    return false;
  }

  return true;
}

async function readFileSym(path) {
  const paths = new Set();

  while (true) {
    const stat = await fsLstat(path);

    if (stat.isSymbolicLink()) {
      paths.add(path);
      path = await fsRealpath(path);

      if (paths.has(path)) {
        throw new Error('cyclic symlinks');
      }

      continue;
    }

    if (stat.isFile()) {
      break;
    }

    throw new Error(`${path} is of unknown stat: understanding symlinks, dirs and files`);
  }
  
  return await fsReadFile(path);
}