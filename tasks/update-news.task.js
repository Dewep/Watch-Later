async function updateNews (app, parameters) {
  const topRatedMovies = await app.tmdb.discover({
    'release_date.gte': '2017-06-19',
    sort_by: 'popularity.desc'
  })

  console.log('topRated:', topRatedMovies)

  const inTheatres = await app.tmdb.discover({
    region: 'FR',
    'release_date.gte': '2017-08-05',
    'release_date.lte': '2017-09-05',
    sort_by: 'popularity.desc'
  })

  console.log('inTheatres:', inTheatres)
}

module.exports = updateNews
