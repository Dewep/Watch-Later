module.exports = {
  server: {
    host: '127.0.0.1',
    port: 3221
  },
  tmdb: {
    apiKey: null // https://www.themoviedb.org/settings/api
  },
  transmi: {
    baseUrl: null // https://github.com/zajdaf/Transmi (add the '/' at the end)
  },
  tasks: {
    trigger: [
      {
        name: 'update-news',
        hours: 13,
        minutes: 30
      },
      {
        name: 'check-movies-changes',
        hours: 13,
        minutes: 35
      },
      {
        name: 'check-in-theatres',
        hours: 13,
        minutes: 40
      },
      {
        name: 'check-movies-transmi',
        hours: 13,
        minutes: 40
      }
    ]
  },
  mongo: {
    host: 'localhost',
    port: 27017,
    database: 'watch-later'
  }
}
