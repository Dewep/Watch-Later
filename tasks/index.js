class Tasks {
  constructor (config, app) {
    this.config = config
    this.app = app
  }

  async run () {
  }

  async runTask (taskName, parameters) {
    try {
      return await require(`./${taskName}.task`)(this.app, parameters)
    } catch (err) {
      console.error(`[tasks.${taskName}] error:`, err)
      throw err
    }
  }
}

module.exports = Tasks
