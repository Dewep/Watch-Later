async function movieTorrents (app, parameters) {
  const logs = {
    query: {},
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
    if (movie['title_fr']) {
      searchQueries.push(movie['title_fr'])
    }
    if (movie['title_en']) {
      searchQueries.push(movie['title_en'])
    }
    if (movie['original_title']) {
      searchQueries.push(movie['original_title'])
    }

    const torrents = await app.torrents.searchQueries(searchQueries, 6)

    const updateQuery = { 'tmdb_id': movie.tmdb_id }
    const updateAction = { $set: { torrents }}

    await app.mongo.update('movie', updateQuery, updateAction)

    if (!movie.torrents) {
      logs.created += 1
    } else if (movie.torrents.length === 0 && torrents.length > 0) {
      logs.updated += 1
      // TODO: send emails
    } else {
      logs.updated += 1
    }
  }

  return logs
}

module.exports = movieTorrents
