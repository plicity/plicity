#!/usr/bin/env node

const {spawn} = require('child_process');
const path = require('path');
const stream = require('stream');
const chalk = require('chalk');
const ora = require('ora');
const copy = require('recursive-copy');
const nunjucks = require('nunjucks');
const {argv} = require('yargs')
  .option('link', {
    alias: 'l',
    type: 'boolean'
  })
  .option('npm-registry', {
    type: 'string'
  })
  .option('npm-strict-ssl', {
    type: 'boolean',
    default: true
  })
  .demandCommand(1)
;

const NJ_EXT = '.nj';

(async () => {
  let [dir] = argv._;
      
  const placeholders = {
    npm: {
      registry: argv['npm-registry'],
      strictSSL: argv['npm-strict-ssl']
    }
  };

  {
    const spinner = ora(`copy files`).start();
    let fileCount = 0;

    try {
      await copy(`${__dirname}/plicity-template`, dir, {
        dot: true,
        rename(src) {
          const pp = path.parse(src);
          if (!pp.base.endsWith(NJ_EXT)) {
            return src;
          }

          return path.join(pp.dir, pp.base.substring(0, pp.base.length - NJ_EXT.length));
        },
        transform(src, dest, stats) {
          const pp = path.parse(src);
          if (!pp.base.endsWith(NJ_EXT)) {
            return new stream.PassThrough();
          }

          const bufs = [];
          return new stream.Transform({
            transform(chunk, encoding, callback) {
              bufs.push(chunk);
              callback();
            },
            flush(callback) {
              const buf = Buffer.concat(bufs);
              nunjucks.renderString(buf.toString(), placeholders, (err, res) => {
                if (err) {
                  callback(err);
                  return;
                }

                this.push(res);
                this.push(null);
                callback();
              });
            }
          });
        }
      })
        .on(copy.events.COPY_FILE_COMPLETE, () => {
          fileCount++;
          spinner.text = `copyied ${fileCount} files`;
        });

      spinner.succeed(`copied ${fileCount} files to ${dir}`);
    } catch (e) {
      spinner.fail();
      console.error(e);
      return die();
    }
  }

  const plicityDir = `${dir}/.plicity`;

  {
    const spinner = ora().start();

    try {
      spinner.text = 'install dependencies';
      await spawn2('npm', ['i', '--save', 'dotenv'], {cwd: plicityDir});

      if (!argv.link) {
        await spawn2('npm', ['i', '--save', '@plicity/operator'], {cwd: plicityDir});
      } else {
        spinner.text = 'link dependencies';
        await spawn2('npm', ['link', '@plicity/operator'], {cwd: plicityDir});
      }

      spinner.succeed();
    } catch (e) {
      spinner.fail();
      console.error(e.error);
      console.error(e.stderr.toString());
      return die();
    }
  }

  {
    console.log(`1. goto your project: ${chalk.blue(dir)}`);
    console.log('2. commit and push');
    console.log(`3. install pli executable: $ ${chalk.yellow('npm')} i -g @plicity/operator`);
    console.log(`4. update ${chalk.blue('plicity.env')}`);
    console.log(`5. initialize operator: $ ${chalk.yellow('pli')} init`);
    console.log(`6. you can check your setup: $ ${chalk.yellow('pli')} check`);
  }

})();

async function spawn2(...args) {
  const proc = spawn(...args);

  proc.stdout.on('data', pump0);
  proc.stderr.on('data', pump2);

  const buf0 = [];
  const buf2 = [];

  return await new Promise((resolve, reject) => {
    proc.once('close', (code, signal) => {
      proc.stdout.off('data', pump0);
      proc.stderr.off('data', pump2);

      const stdio = {
        stdout: Buffer.concat(buf0),
        stderr: Buffer.concat(buf2)
      };

      if (code !== 0) {
        reject({
          error: new Error(`error ${args[0]} with code: ${code}, signal: ${signal}.`),
          ...stdio
        });

        return;
      }

      resolve(stdio);
    });
  });

  function pump0(data) {
    buf0.push(data);
  }

  function pump2(data) {
    buf2.push(data);
  }
}

function die() {
  process.exit(1);
}