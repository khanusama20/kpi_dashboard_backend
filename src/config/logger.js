const path = require('path');
var bunyan = require('bunyan'),
  bformat = require('bunyan-format'),
  formatOut = bformat({
    color: 'true'
  }),
  abspath = process.cwd().split('/'),
  logger

let newLogPath = abspath.slice(0, abspath.length - 1).join('/');
console.log("logging directory ->", newLogPath)

var bunyanOpts = {
  name: 'ManagerKPI',
  serializers: {
    req: (req) => ({
      method: req.method,
      url: req.url,
      headers: req.headers,
      body: req.body,
      params: req.params,
      query: req.query,
    }),
  },
  streams: [{
      level: 'debug',
      stream: formatOut, // log INFO and above to stdout
    },
    {
      level: 'info',
      path: path.join(newLogPath, '/server-logs.json')
    }
  ]
}

var createLogger = function createLogger() {
  if (logger) {
    return logger
  }

  // console.log("logging directory ->", logdir)
  logger = bunyan.createLogger(bunyanOpts)
  return logger
}

module.exports = createLogger