const config = require('./config')

const app = {}

const modules = ['mongo', 'email', 'tasks', 'server', 'tmdb', 'allocine', 'transmi']

// Init modules
modules.forEach(function (moduleName) {
  const ComponentClass = require(`./${moduleName}`)
  app[moduleName] = new ComponentClass(config[moduleName] || {}, app)
})

// Run modules (cron-tasks, server listening, and so on)
modules.forEach(function (moduleName) {
  app[moduleName].run()
})
