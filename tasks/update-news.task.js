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

  const movies = {}

  const addMovie = (movie, lang) => {
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

  console.log('[tasks.update-news]', moviesList.length, 'movies added')
}

module.exports = updateNews
