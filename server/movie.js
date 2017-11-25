const express = require('express')
const utils = require('./utils')

async function getOrFetchMovie (app, tmdbId) {
  tmdbId = +tmdbId

  try {
    const movie = await app.mongo.getOne('movie', { 'tmdb_id': tmdbId })
    return movie
  } catch (err) {
    const fr = await app.tmdb.movieDetails(tmdbId, 'fr-FR')
    const en = await app.tmdb.movieDetails(tmdbId, 'en-US')

    const getTitle = iso => (en.alternative_titles.titles.find(t => t.iso_3166_1 === iso) || {}).title || null
    const getReleaseDate = iso => {
      const releases = en.release_dates.results.find(r => r.iso_3166_1 === iso)
      const release = releases && releases.release_dates.find(r => r.type === 3)
      return (release && release.release_date) || null
    }

    const movie = {
      'tmdb_id': tmdbId,
      'backdrop_fr': (fr.backdrop_path && app.tmdb.backdropUrl(fr.backdrop_path)) || null,
      'backdrop_en': (en.backdrop_path && app.tmdb.backdropUrl(en.backdrop_path)) || null,
      genres: en.genres.map(g => g.name),
      'homepage_fr': fr.homepage || null,
      'homepage_en': en.homepage || null,
      'original_title': en.original_title || null,
      'overview_fr': fr.overview || null,
      'overview_en': en.overview || null,
      'poster_fr': (fr.poster_path && app.tmdb.posterUrl(fr.poster_path)) || null,
      'poster_en': (en.poster_path && app.tmdb.posterUrl(en.poster_path)) || null,
      runtime: en.runtime,
      status: en.status,
      'title_fr': getTitle('FR') || fr.title || null,
      'title_en': getTitle('US') || en.title || null,
      'release_date_fr': getReleaseDate('FR') || en.release_date || null,
      'release_date_en': getReleaseDate('US') || en.release_date || null,
      'videos_fr': fr.videos.results.map(v => v.key),
      'videos_en': en.videos.results.map(v => v.key),
      'vote_average': fr.vote_average || en.vote_average || null,
      'in_theatres': null,
      'torrents': null
    }

    await app.mongo.insert('movie', movie)

    app.tasks.runTask('movie-in-theatres', { tmdbId }).catch(err => console.error('[movie-creation] Error task.movie-in-theatres', err))
    app.tasks.runTask('movie-torrents', { tmdbId }).catch(err => console.error('[movie-creation] Error task.movie-torrents', err))

    return movie
  }
}

const movieRouter = (app) => {
  const router = express.Router()

  router.get('/', utils.asyncUse(async (req, res, next) => {
    const movieIds = req.user.watchLater || []
    const movies = await Promise.all(movieIds.map(id => getOrFetchMovie(app, id)))
    return res.json({ movies })
  }))

  router.get('/:tmdbId/', utils.asyncUse(async (req, res, next) => {
    const movie = await getOrFetchMovie(app, +req.params.tmdbId)
    return res.json({ movie })
  }))

  const editMovieUserPreference = (user, tmdbId, status) => {
    const update = {
      $set: {
        watchLater: (user.watchLater || []).filter(id => id && id !== tmdbId),
        ignored: (user.ignored || []).filter(id => id && id !== tmdbId)
      }
    }
    if (update.$set[status]) {
      update.$set[status].push(tmdbId)
    }
    return app.mongo.update('user', { email: user.email }, update)
  }

  router.post('/:tmdbId/watch-later/', utils.asyncUse(async (req, res, next) => {
    const tmdbId = +req.params.tmdbId
    if (tmdbId > 0) {
      await editMovieUserPreference(req.user, tmdbId, 'watchLater')
    }
    res.json({})
  }))

  router.post('/:tmdbId/ignored/', utils.asyncUse(async (req, res, next) => {
    const tmdbId = +req.params.tmdbId
    if (tmdbId > 0) {
      await editMovieUserPreference(req.user, tmdbId, 'ignored')
    }
    res.json({})
  }))

  return router
}

module.exports.router = movieRouter
