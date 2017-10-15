const express = require('express')
const utils = require('./utils')

const newsRouter = (app) => {
  const router = express.Router()

  router.get('/', utils.asyncUse(async (req, res, next) => {
    const ignoredIds = [...req.user.watchLater, ...req.user.ignored]
    const news = await app.mongo.find('news', { 'tmdb_id': { $nin: ignoredIds }})
    res.json({ news })
  }))

  return router
}

module.exports.router = newsRouter
