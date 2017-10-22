const { promisify } = require('util')
const ejs = require('ejs')

const renderFile = promisify(ejs.renderFile).bind(ejs)

class Template {
  constructor (config, app) {
    this.config = config
    this.app = app
  }

  async run () {
    /* console.log(this.sparamsToString({
      f: 'email/updates',
      d: {
        name: 'Dewep',
        movies: [
          {
            tmdbId: 315837,
            title: 'Ghost in the Shell',
            status: 'Released',
            releaseDateFr: '2017-03-29',
            releaseDateEn: '2017-03-31',
            backdrop: 'https://image.tmdb.org/t/p/w1280/jGPSVArC0GS2VVc0aGAqGTjfFOG.jpg',
            poster: 'https://image.tmdb.org/t/p/w342/hqZFvDYiCKOXbfSZuIEJUuQW29n.jpg'
          },
          {
            tmdbId: 283995,
            title: 'Guardians of the Galaxy Vol. 2',
            status: 'Released',
            releaseDateFr: '2017-03-29',
            releaseDateEn: '2017-03-31',
            backdrop: 'https://image.tmdb.org/t/p/w1280/aJn9XeesqsrSLKcHfHP4u5985hn.jpg',
            poster: 'https://image.tmdb.org/t/p/w342/y4MBh0EjBlMuOzv9axM4qJlmhzz.jpg'
          },
          {
            tmdbId: 283995,
            title: 'Guardians of the Galaxy Vol. 2',
            status: 'Future',
            releaseDateFr: '2017-03-29',
            poster: 'https://image.tmdb.org/t/p/w342/y4MBh0EjBlMuOzv9axM4qJlmhzz.jpg'
          },
          {
            tmdbId: 283995,
            title: 'Guardians of the Galaxy Vol. 2',
            status: 'Future'
          }
        ]
      }
    })) */
  }

  async render (file, data, options) {
    const sparams = this.sparamsToString({ f: file, d: data || {}})
    data.sparams = sparams
    data.config = this.config
    return renderFile(`template/${file}.ejs`, data, options)
  }

  sparamsToString (content) {
    return Buffer.from(JSON.stringify(content)).toString('base64').replace('+', '-').replace('/', '.').replace('=', '_')
  }
  stringToSparams (content) {
    try {
      return JSON.parse(Buffer.from(content.replace('-', '+').replace('.', '/').replace('_', '='), 'base64').toString('ascii'))
    } catch (e) {
      console.error('[template.parse]', e)
      return {}
    }
  }
}

module.exports = Template
