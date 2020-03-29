const {VError} = require('verror');

module.exports = {
  async verrWrap(asyncCbOrPromise, message = undefined, ...params) {
    if (asyncCbOrPromise instanceof Function) {
      asyncCbOrPromise = asyncCbOrPromise();
    }

    try {
      return await asyncCbOrPromise;
    } catch (e) {
      throw new VError(e, message, ...params);
    }
  }
};