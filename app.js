const config = require('./config')

const app = {}

async function runModules (modules) {
  // Init modules
  modules.forEach(function (moduleName) {
    const ComponentClass = require(`./${moduleName}`)
    app[moduleName] = new ComponentClass(config[moduleName] || {}, app)
  })

  // Run modules (cron-tasks, server listening, and so on)
  for (let index = 0; index < modules.length; index++) {
    await app[modules[index]].run()
  }
}

runModules(['mongo', 'email', 'tasks', 'server', 'tmdb', 'allocine', 'transmi']).catch(err => {
  console.error('[run-error]', err)
  process.exit(1)
})
