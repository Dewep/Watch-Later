const { promisify } = require('util')
const ejs = require('ejs')

const renderFile = promisify(ejs.renderFile).bind(ejs)

class Template {
  constructor (config, app) {
    this.config = config
    this.app = app
  }

  async run () {
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
