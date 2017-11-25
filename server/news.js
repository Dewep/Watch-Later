const express = require('express')
const utils = require('./utils')

const newsRouter = (app) => {
  const router = express.Router()

  router.get('/', utils.asyncUse(async (req, res, next) => {
    const filters = {
      'tmdb_id': {
        $nin: [...req.user.watchLater, ...req.user.ignored]
      },
      genres: {
        $in: req.user.genres || [],
        $nin: req.user.excludeGenres || []
      }
    }
    const news = await app.mongo.find('news', filters)
    res.json({ news })
  }))

  return router
}

module.exports.router = newsRouter
