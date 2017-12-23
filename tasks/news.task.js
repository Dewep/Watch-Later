const moment = require('moment')

async function news (app) {
  const dateStartTopRated = moment().subtract(2, 'month').format('YYYY-MM-DD')

  const topRatedMoviesEN = await app.tmdb.discover({
    'release_date.gte': dateStartTopRated,
    'sort_by': 'popularity.desc'
  })

  const topRatedMoviesFR = await app.tmdb.discover({
    language: 'fr-FR',
    region: 'FR',
    'release_date.gte': dateStartTopRated,
    'sort_by': 'popularity.desc'
  })

  const inTheatres = await app.tmdb.discover({
    language: 'fr-FR',
    region: 'FR',
    'release_date.gte': moment().subtract(2, 'weeks').format('YYYY-MM-DD'),
    'release_date.lte': moment().add(3, 'weeks').format('YYYY-MM-DD'),
    'sort_by': 'popularity.desc'
  })

  const oldNews = await app.mongo.find('news')
  const oldTmdbIds = oldNews.map(n => n.tmdb_id)
  const newTmdbIds = []
  const movies = {}

  const addMovie = (movie, lang) => {
    if (oldTmdbIds.indexOf(movie.id) === -1) {
      newTmdbIds.push(movie.id)
    }
    if (!movies[movie.id]) {
      movies[movie.id] = {
        'tmdb_id': movie.id,
        genres: movie.genre_ids
      }
    }
    movies[movie.id][`title_${lang}`] = movie.title
    movies[movie.id][`poster_${lang}`] = app.tmdb.posterUrl(movie.poster_path)
    movies[movie.id][`release_date_${lang}`] = movie.release_date
    movies[movie.id][`overview_${lang}`] = movie.overview
  }

  topRatedMoviesEN.forEach(movie => addMovie(movie, 'en'))
  topRatedMoviesFR.forEach(movie => addMovie(movie, 'fr'))
  inTheatres.forEach(movie => addMovie(movie, 'fr'))

  const moviesList = Object.values(movies)
  await app.mongo.removeMany('news', {})
  await app.mongo.insertMany('news', moviesList)

  const users = await app.mongo.find('user')
  const emails = []

  for (let index = 0; index < users.length; index++) {
    const user = users[index]

    if (user.notifications && user.notifications.news) {
      const userMovies = newTmdbIds.filter(tmdbId => {
        if (user.watchLater.indexOf(tmdbId) !== -1) {
          return false
        }
        if (user.ignored.indexOf(tmdbId) !== -1) {
          return false
        }
        if (user.excludeGenres && user.excludeGenres.some(genreId => movies[tmdbId].genres.indexOf(genreId) !== -1)) {
          return false
        }
        if (user.genres.some(genreId => movies[tmdbId].genres.indexOf(genreId) !== -1)) {
          return true
        }
        return false
      }).map(tmdbId => ({
        tmdbId,
        title: movies[tmdbId].title_fr || movies[tmdbId].title_en || `#${tmdbId}`,
        poster: movies[tmdbId].poster_fr || movies[tmdbId].poster_en || '',
        releaseDateEn: movies[tmdbId].release_date_en,
        releaseDateFr: movies[tmdbId].release_date_fr,
        overview: movies[tmdbId].overview_fr || movies[tmdbId].overview_en || ''
      }))

      if (userMovies.length) {
        await app.email.sendUpdates(user.email, user.name, userMovies)
        emails.push(user.email)
      }
    }
  }

  const res = { addedMovies: moviesList.length, newMovies: newTmdbIds.length, emails }

  return res
}

module.exports = news
