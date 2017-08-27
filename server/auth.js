const express = require('express')

const apiKeys = {}

const authRouter = (app) => {
  const router = express.Router()

  router.post('/', (req, res, next) => {
    // app.mongo.removeMany('news', {})
    // TODO
    res.json({})
  })

  return router
}

const authRouterAuthenticated = () => {
  const router = express.Router()

  router.get('/', (req, res, next) => {
    res.json(req.user)
  })

  router.delete('/', (req, res, next) => {
    delete apiKeys[req.apiKey]
    res.json({})
  })

  return router
}

const authorizationCheck = (req, res, next) => {
  if (req.headers.authorization && apiKeys.indexOf(req.headers.authorization) !== -1) {
    req.apiKey = req.headers.authorization
    req.user = apiKeys[req.headers.authorization]
    return next()
  }

  const err = new Error('Unauthorized')
  err.status = 401
  next(err)
}

module.exports.router = authRouter
module.exports.routerAuthenticated = authRouterAuthenticated
module.exports.authorizationCheck = authorizationCheck
