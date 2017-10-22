const request = require('request-promise')

class TMDb {
  constructor (config, app) {
    this.config = config
    this.app = app
  }

  async run () {
  }

  imageUrl (filePath, size) {
    return `https://image.tmdb.org/t/p/${size}${filePath}`
  }

  posterUrl (filePath, size) {
    return this.imageUrl(filePath, size || 'w342')
  }

  backdropUrl (filePath, size) {
    return this.imageUrl(filePath, size || 'w1280')
  }

  async request (endPoint, qs, body, method) {
    if (!method) {
      method = 'GET'
      body = '{}'
    }
    if (this.config.apiKey) {
      qs['api_key'] = this.config.apiKey
    }
    var options = {
      method,
      url: `https://api.themoviedb.org/3${endPoint}`,
      qs,
      json: true,
      body
    }
    try {
      return await request(options)
    } catch (err) {
      const simplifiedError = new Error(err.message || err.error)
      simplifiedError.name = err.name
      simplifiedError.statusCode = err.statusCode
      throw simplifiedError
    }
  }

  async discover (qs) {
    const response = await this.request('/discover/movie', qs)
    return response.results
  }

  async movieDetails (id, language) {
    const qs = {
      language: language || 'en-US',
      'append_to_response': 'alternative_titles,release_dates,videos'
    }
    return this.request(`/movie/${id}`, qs)
  }
}

module.exports = TMDb
