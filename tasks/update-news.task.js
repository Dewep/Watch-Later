async function updateNews (app) {
  const topRatedMoviesEN = await app.tmdb.discover({
    'release_date.gte': '2017-06-19',
    'sort_by': 'popularity.desc'
  })

  const topRatedMoviesFR = await app.tmdb.discover({
    language: 'fr-FR',
    region: 'FR',
    'release_date.gte': '2017-06-19',
    'sort_by': 'popularity.desc'
  })

  const inTheatres = await app.tmdb.discover({
    language: 'fr-FR',
    region: 'FR',
    'release_date.gte': '2017-08-05',
    'release_date.lte': '2017-09-05',
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
    const userMovies = newTmdbIds.filter(tmdbId => {
      if (user.watchLater.indexOf(tmdbId) !== -1) {
        return false
      }
      if (user.ignored.indexOf(tmdbId) !== -1) {
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
      await app.email.sendUpdates(user.email, user.name || 'DefaultName', userMovies)
      emails.push(user.email)
    }
  }

  const res = { addedMovies: moviesList.length, newMovies: newTmdbIds.length, emails }

  console.log('[tasks.update-news]', res)
  return res
}

module.exports = updateNews
