const express = require('express')
const utils = require('./utils')

const adminRouter = (app) => {
  const router = express.Router()

  router.use((req, res, next) => {
    if (req.user.isAdmin) {
      next()
    } else {
      const err = new Error('Access forbidden')
      err.status = 403
      next(err)
    }
  })

  router.post('/:taskName/', utils.asyncUse(async (req, res, next) => {
    const response = {
      status: 'success',
      result: null
    }
    try {
      response.result = await app.tasks.runTask(req.params.taskName, req.body)
    } catch (err) {
      response.status = 'failed'
      response.result = {
        error: {
          name: err.name,
          message: err.message
        }
      }
    }
    res.json(response)
  }))

  return router
}

module.exports.router = adminRouter
