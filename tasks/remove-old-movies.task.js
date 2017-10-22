async function removeOldMovies (app, parameters) {
  const news = await app.mongo.find('news', {}, null, null, { _id: 0, 'tmdb_id': 1 })
  const users = await app.mongo.find('user', {}, null, null, { _id: 0, watchLater: 1 })

  const idsToIgnore = news.map(n => n['tmdb_id'])
  users.forEach(user => {
    user.watchLater.forEach(tmdbId => {
      if (idsToIgnore.indexOf(tmdbId) === -1) {
        idsToIgnore.push(tmdbId)
      }
    })
  })

  const removeStats = await app.mongo.removeMany('movie', { 'tmdb_id': { $nin: idsToIgnore }})
  return { removeStats }
}

module.exports = removeOldMovies
