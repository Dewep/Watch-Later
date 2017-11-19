module.exports = {
  server: {
    host: '127.0.0.1',
    port: 3221
  },
  tmdb: {
    apiKey: null // https://www.themoviedb.org/settings/api
  },
  torrents: {
    providers: ['Rarbg', 'Torrent9'] // ['Rarbg', 'Torrent9', 'T411']
  },
  email: {
    mailjet: { // https://app.mailjet.com/account/setup
      username: null,
      password: null
    }
  },
  template: {
    baseUrl: 'https://wl.dewep.net'
  },
  tasks: {
    trigger: [
      {
        name: 'update-all',
        hours: 13,
        minutes: 30
      }
    ]
  },
  mongo: {
    host: 'localhost',
    port: 27017,
    database: 'watch-later'
  }
}
