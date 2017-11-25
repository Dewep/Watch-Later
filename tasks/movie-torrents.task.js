async function movieTorrents (app, parameters) {
  const logs = {
    query: {},
    searches: {},
    emails: [],
    created: 0,
    updated: 0
  }

  if (parameters.tmdbId) {
    logs.query['tmdb_id'] = parameters.tmdbId
  }

  const movies = await app.mongo.find('movie', logs.query)

  for (let index = 0; index < movies.length; index++) {
    const movie = movies[index]

    const searchQueries = []
    const year = movie['release_date_en'] ? ' ' + movie['release_date_en'].slice(0, 4) : ''
    if (movie['title_fr']) {
      searchQueries.push(movie['title_fr'] + year)
    }
    if (movie['original_title'] && searchQueries.indexOf(movie['original_title']) === -1) {
      searchQueries.push(movie['original_title'] + year)
    }
    if (movie['title_en'] && searchQueries.indexOf(movie['title_en']) === -1) {
      searchQueries.push(movie['title_en'] + year)
    }

    logs.searches[movie.tmdb_id] = searchQueries
    const torrents = await app.torrents.searchQueries(searchQueries, 6)

    const updateQuery = { 'tmdb_id': movie.tmdb_id }
    const updateAction = { $set: { torrents }}

    await app.mongo.update('movie', updateQuery, updateAction)
    movie.torrents = torrents

    if (!movie.torrents) {
      logs.created += 1
    } else if (movie.torrents.length === 0 && torrents.length > 0) {
      logs.updated += 1

      const users = await app.mongo.find('user', { 'notifications.movieTorrents': true, watchLater: +movie.tmdb_id })
      for (let index = 0; index < users.length; index++) {
        await app.email.sendMovieTorrents(users[index].email, users[index].name, movie)
        logs.emails.push(users[index].email)
      }
    } else {
      logs.updated += 1
    }
  }

  return logs
}

module.exports = movieTorrents
