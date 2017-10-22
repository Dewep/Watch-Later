async function updateAll (app) {
  const res = {}
  const tasks = ['news', 'remove-old-movies', 'movie-changes', 'movie-in-theatres', 'movie-torrents']

  for (let index = 0; index < tasks.length; index++) {
    res[tasks[index]] = await app.tasks.runTask(tasks[index])
  }

  return res
}

module.exports = updateAll
