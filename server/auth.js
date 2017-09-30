const express = require('express')
const bcrypt = require('bcryptjs')
const crypto = require('crypto')
const utils = require('./utils')

const apiKeys = {}

const authRouter = (app) => {
  const router = express.Router()

  router.post('/', utils.asyncUse(async (req, res, next) => {
    const user = await app.mongo.getOne('user', { email: req.body.email })
    await new Promise(function (resolve, reject) {
      bcrypt.compare(req.body.password, user.password, function (err, res) {
        if (err) {
          reject(err)
        } else if (res === true) {
          resolve()
        } else {
          reject(new Error('Bad password'))
        }
      })
    })
    const apiKey = await new Promise(function (resolve, reject) {
      crypto.randomBytes(48, function (err, buffer) {
        if (err) {
          reject(err)
        } else {
          resolve(buffer.toString('hex'))
        }
      })
    })
    delete user.password
    apiKeys[apiKey] = user.email
    res.json({ apiKey, user })
  }))

  return router
}

const authRouterAuthenticated = (app) => {
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

const authorizationCheck = app => {
  return utils.asyncUse(async (req, res, next) => {
    if (req.headers.authorization && apiKeys[req.headers.authorization]) {
      req.apiKey = req.headers.authorization
      try {
        const user = await app.mongo.getOne('user', { email: apiKeys[req.headers.authorization] })
        delete user.password
        req.user = user
      } catch (e) {
        const err = new Error('Session expired')
        err.status = 401
        next(err)
      }
      return next()
    }

    const err = new Error('Unauthorized')
    err.status = 401
    next(err)
  })
}

module.exports.router = authRouter
module.exports.routerAuthenticated = authRouterAuthenticated
module.exports.authorizationCheck = authorizationCheck
