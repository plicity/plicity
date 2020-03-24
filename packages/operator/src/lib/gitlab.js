const {Gitlab} = require('gitlab');

module.exports = {
  createGitlab(host, token) {
    return new Gitlab({host, token});
  }
};