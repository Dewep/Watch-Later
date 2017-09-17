const express = require('express')
const bodyParser = require('body-parser')
const authRoutes = require('./auth')
const newsRoutes = require('./news')

class Server {
  constructor (config, app) {
    this.config = config
    this.app = app

    this.server = express()

    this.server.use(bodyParser.json({ limit: '10mb' }))
    this.server.use(this.logger)

    this.server.use('/api/auth', authRoutes.router(this.app))
    this.server.use('/api', authRoutes.authorizationCheck)
    this.server.use('/api/auth', authRoutes.routerAuthenticated(this.app))
    this.server.use('/api/news', newsRoutes.router(this.app))

    this.server.use(this.errorHandling)

    this.server.use(express.static('public'))
  }

  logger (req, res, next) {
    console.info('[server]', req.method, req.originalUrl, 'from', req.ip)
    next()
  }

  errorHandling (err, req, res, next) {
    if (!err.status) {
      err.status = 400
    }
    res.status(err.status)
    res.json({ error: err.message })
    console.error(err.stack)
  }

  async run () {
    this.server.listen(this.config.port, this.config.host, () => {
      console.info('[server] running on', `${this.config.host}:${this.config.port}`)
    })
  }
}

module.exports = Server
