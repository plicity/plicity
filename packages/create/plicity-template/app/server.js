
const http = require('http');

const server = new http.Server((req, res) => {
  res.end(`hi from plicity on branch ${process.env.BRANCH || '<unknown>'}! :)`);
});

server.listen(3000, '0.0.0.0');