const request = require('request-promise')

class TMDb {
  constructor (config, app) {
    this.config = config
    this.app = app
  }

  async run () {
    // this.app.tasks.runTask('update-news').catch(() => {})
  }

  async request (endPoint, qs, body, method) {
    if (!method) {
      method = 'GET'
      body = '{}'
    }
    if (this.config.apiKey) {
      qs.api_key = this.config.apiKey
    }
    var options = {
      method,
      url: `https://api.themoviedb.org/3${endPoint}`,
      qs,
      body
    }
    try {
      return await request(options)
    } catch (err) {
      const simplifiedError = new Error(err.error || err.message)
      simplifiedError.name = err.name
      simplifiedError.statusCode = err.statusCode
      throw simplifiedError
    }
  }

  async discover (qs) {
    const response = await this.request('/discover/movie', qs)
    return response.results
  }
}

module.exports = TMDb
