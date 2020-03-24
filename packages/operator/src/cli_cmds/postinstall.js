const fs = require('fs');
const {pipeline} = require('stream');
const {promisify} = require('util');
const zlib = require('zlib');
const bytes = require('bytes');
const {default: fetch} = require('node-fetch');
const ora = require('ora');
const tar = require('tar-stream');
const yargs = require('yargs');
const wrap = require('../lib/async-wrap');
const openshift = require('../lib/openshift');

/** @type {yargs.CommandModule} */
const mod = {
  command: 'postinstall',
  describe: 'postinstall',
  handler: wrap(async () => {
    await downloadOc();
  })
};

module.exports = mod;

async function downloadOc() {

  const ocBinDeleteSpinner = ora('checking oc bin').start();
  try {
    await promisify(fs.access)(openshift.oc.OC_BIN);
    ocBinDeleteSpinner.text = `found ${openshift.oc.OC_BIN}`;
    await promisify(fs.unlink)(openshift.oc.OC_BIN);
    ocBinDeleteSpinner.succeed(`deleted ${openshift.oc.OC_BIN}`);
  } catch (e) {
    ocBinDeleteSpinner.info(`no ${openshift.oc.OC_BIN} found`);
  }

  const ocDownloadSpinner = ora('downloading oc tools').start();

  const res = await fetch('https://github.com/openshift/origin/releases/download/v3.11.0/openshift-origin-client-tools-v3.11.0-0cbc58b-linux-64bit.tar.gz', {follow: 5});
  const extract = tar.extract();
  pipeline(res.body, zlib.createGunzip(), extract, () => {});

  let ocExtracted = false;
  extract.on('entry', (header, stream, next) => {
    if (!ocExtracted && /openshift\-[^\/]+\/oc/.test(header.name)) {
      ocDownloadSpinner.text = `extract ${header.name}`;

      let extractedBytes = 0;
      stream.on('data', countBytes);

      function countBytes(data) {
        extractedBytes += data.length;
        ocDownloadSpinner.text = `extract ${header.name} ${bytes(extractedBytes)}`;
      }

      ocExtracted = true;
      pipeline(stream, fs.createWriteStream(openshift.oc.OC_BIN, {mode: header.mode}), err => {
        ocDownloadSpinner.succeed('oc binary extracted');
        extract.destroy(err);
        stream.off('data', countBytes);
      });
    } else {
      ocDownloadSpinner.text = `draining ${header.name}`;

      // drain
      stream.on('end', next);
      stream.resume();
    }
  });

  return await new Promise((resolve, reject) => {
    extract.once('close', () => {
      if (!ocExtracted) {
        ocDownloadSpinner.fail('no oc executable found in archive');
        reject(new Error('could not find oc executable in targz file'));
        return;
      }

      resolve();
    });
  });
}
