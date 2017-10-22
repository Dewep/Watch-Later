async function movieInTheatres (app, parameters) {
  const logs = {
    query: {},
    created: 0,
    updated: 0,
    upToDate: 0,
    ignored: 0
  }

  if (parameters.tmdbId) {
    logs.query['tmdb_id'] = parameters.tmdbId
  }

  const movies = await app.mongo.find('movie', logs.query)

  for (let index = 0; index < movies.length; index++) {
    const movie = movies[index]

    if (!movie.release_date_fr && !movie.release_date_en) {
      logs.ignored += 1
      continue
    }

    const now = new Date().getTime()
    const release = new Date(movie.release_date_fr || movie.release_date_en).getTime()
    const diffDays = Math.round((now - release) / (1000 * 60 * 60 * 24))

    const isInTheatres = diffDays >= -4 && diffDays <= 14

    const updateQuery = { 'tmdb_id': movie.tmdb_id }
    const updateAction = { $set: { 'in_theatres': isInTheatres }}

    if (movie['in_theatres'] === null) {
      logs.created += 1
      await app.mongo.update('movie', updateQuery, updateAction)
    } else if (movie['in_theatres'] === false && isInTheatres === true) {
      logs.updated += 1
      await app.mongo.update('movie', updateQuery, updateAction)
      // TODO: send emails
    } else if (movie['in_theatres'] !== isInTheatres) {
      logs.updated += 1
      await app.mongo.update('movie', updateQuery, updateAction)
    } else {
      logs.upToDate += 1
    }
  }

  return logs
}

module.exports = movieInTheatres
