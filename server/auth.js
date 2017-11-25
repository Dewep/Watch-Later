const express = require('express')
const bcrypt = require('bcryptjs')
const crypto = require('crypto')
const utils = require('./utils')

const apiKeys = {}
const passwordTokens = {}

async function requestRecoverPassword (app, email, newAccount) {
  const user = await app.mongo.getOne('user', { email })
  const token = await new Promise(function (resolve, reject) {
    crypto.randomBytes(48, function (err, buffer) {
      if (err) {
        reject(err)
      } else {
        resolve(buffer.toString('hex'))
      }
    })
  })
  passwordTokens[token] = user.email

  await app.email.sendRecoverPassword(user.email, user.name, token, newAccount)
}

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

  router.post('/password/', utils.asyncUse(async (req, res, next) => {
    await requestRecoverPassword(app, req.body.email, false)
    res.json({})
  }))

  router.post('/password/:token/', utils.asyncUse(async (req, res, next) => {
    const email = passwordTokens[req.params.token]
    if (!email) {
      throw new Error('Bad password token')
    }
    if (!req.body.password) {
      throw new Error('You must provide a password')
    }

    const password = await new Promise(function (resolve, reject) {
      bcrypt.hash(req.body.password, 8, function (err, hash) {
        if (err) {
          reject(err)
        } else {
          resolve(hash)
        }
      })
    })

    await app.mongo.update('user', { email }, { $set: { password }})

    delete passwordTokens[req.params.token]

    for (const apiKey in apiKeys) {
      if (apiKeys[apiKey] === email) {
        delete apiKeys[apiKey]
      }
    }

    res.json({})
  }))

  return router
}

const authRouterAuthenticated = (app) => {
  const router = express.Router()

  router.get('/', (req, res, next) => {
    res.json(req.user)
  })

  router.put('/', utils.asyncUse(async (req, res, next) => {
    const update = { $set: {}}

    if (req.body.name) {
      update.$set.name = req.body.name
    }
    if (req.body.genres) {
      update.$set.genres = req.body.genres
    }
    if (req.body.excludeGenres) {
      update.$set.excludeGenres = req.body.excludeGenres
    }
    if (req.body.notifications) {
      update.$set.notifications = {
        news: req.body.notifications.news || false,
        movieChanges: req.body.notifications.movieChanges || false,
        movieInTheatres: req.body.notifications.movieInTheatres || false,
        movieTorrents: req.body.notifications.movieTorrents || false
      }
    }

    await app.mongo.update('user', { email: req.user.email }, update)

    const user = await app.mongo.getOne('user', { email: req.user.email })
    delete user.password
    req.user = user

    res.json(req.user)
  }))

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
module.exports.requestRecoverPassword = requestRecoverPassword
