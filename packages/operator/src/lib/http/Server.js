// const net = require('net');
const path = require('path');
const fastify = require('fastify');
const logger = require('../log')(__filename);
const plugins = require('./plugins');

module.exports = class Server {
  constructor(port) {
    // /** @type {Set<net.Socket>} */
    // this._sockets = new Set();
    this._port = port;
  }

  async start({useUiProxy, onServerBuild, name, gitlab}) {
    this._app = fastify({return503OnClosing: true});

    // this._app.server.on('connection', socket => {
    //   this._sockets.add(socket);
    //   socket.once('close', () => {
    //     this._sockets.delete(socket);
    //   });
    // });

    logger.info('register plugins');
    this._app
      .register(plugins.operator, {onServerBuild, name, gitlab})
    ;

    
    if (useUiProxy) {
      logger.info('register fastify-http-proxy using UI proxy %s', useUiProxy);
      this._app.register(require('fastify-http-proxy'), {
        upstream: useUiProxy,
        http2: false
      });
    } else {
      const root = path.normalize(`${require('@plicity/operator-ui')}/build`);
      logger.info('register fastify-static serving UI from %s', root);
      this._app.register(require('fastify-static'), {
        root
      });
    }

    logger.info('start listen');
    return await new Promise((resolve, reject) => {
      this._app.listen(this._port, '0.0.0.0', (err, address) => {
        if (err) {
          reject(new Error('server cannot listen: ' + err));
          return;
        }

        logger.info('server listen %s', address);
        resolve();
      });
    });
  }

  async stop() {
    // TODO(prenoth): do we need this? will fastify do it?
    // const closePromise = this._app.close();

    // for (const socket of this._sockets) {
    //   socket.destroy()
    // }
  }
};
