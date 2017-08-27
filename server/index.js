const express = require('express')
const bodyParser = require('body-parser')
const authRoutes = require('./auth')

class Server {
  constructor (config, app) {
    this.config = config
    this.app = app

    this.server = express()

    this.server.use(bodyParser.json({ limit: '10mb' }))
    this.server.use(this.logger)

    this.server.use(authRoutes)

    this.server.use(express.static('public'))
  }

  logger (req, res, next) {
    console.info('[server]', req.method, req.originalUrl, 'from', req.ip)
    next()
  }

  async run () {
    this.server.listen(this.config.port, this.config.host, () => {
      console.info('[server] running on', `${this.config.host}:${this.config.port}`)
    })
  }
}

module.exports = Server
