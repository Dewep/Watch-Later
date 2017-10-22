const request = require('request-promise')

class Email {
  constructor (config, app) {
    this.config = config
    this.app = app
  }

  async run () {
  }

  async sendEmail (to, name, subject, htmlContent, textContent) {
    const options = {
      method: 'POST',
      url: 'https://api.mailjet.com/v3.1/send',
      auth: {
        username: this.config.mailjet.username,
        password: this.config.mailjet.password
      },
      json: true,
      body: {
        Messages: [
          {
            From: {
              Email: 'contact@wl.dewep.net',
              Name: 'Watch-Later'
            },
            To: [
              {
                Email: to,
                Name: name
              }
            ],
            Subject: subject,
            TextPart: textContent,
            HTMLPart: htmlContent
          }
        ]
      }
    }
    return await request(options)
  }

  async sendUpdates (email, name, movies) {
    const html = await this.app.template.render('email/news', { name, movies })
    await this.sendEmail(email, name, 'New movies available on your Watch-Later', html)
  }

  async sendRecoverPassword (email, name, token, newAccount) {
    const html = await this.app.template.render('email/password', { name, token, newAccount })
    await this.sendEmail(email, name, newAccount ? 'New Watch-Later account' : 'Reset your Watch-Later password', html)
  }

  async sendMovieInTheatres (email, name, movie) {
    const tmdbId = movie.tmdb_id
    const movieTitle = movie.title_fr || movie.title_en || movie.original_title || `Movie #${tmdbId}`
    const title = `${movieTitle} is in theatres!`
    const poster = movie.poster_fr || movie.poster_en || null
    const overview = movie.overview_fr || movie.overview_en || null
    const torrents = movie.torrents || []
    const releaseDateFr = movie.release_date_fr
    const releaseDateEn = movie.release_date_en
    const html = await this.app.template.render('email/movie', { name, tmdbId, title, movieTitle, poster, overview, releaseDateFr, releaseDateEn, torrents })
    await this.sendEmail(email, name, title, html)
  }

  async sendMovieTorrents (email, name, movie) {
    const tmdbId = movie.tmdb_id
    const movieTitle = movie.title_fr || movie.title_en || movie.original_title || `Movie #${tmdbId}`
    const title = `${movieTitle} can now be downloaded!`
    const poster = movie.poster_fr || movie.poster_en || null
    const overview = movie.overview_fr || movie.overview_en || null
    const torrents = movie.torrents || []
    const releaseDateFr = movie.release_date_fr
    const releaseDateEn = movie.release_date_en
    const html = await this.app.template.render('email/movie', { name, tmdbId, title, movieTitle, poster, overview, releaseDateFr, releaseDateEn, torrents })
    await this.sendEmail(email, name, title, html)
  }
}

module.exports = Email
