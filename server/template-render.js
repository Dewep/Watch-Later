const utils = require('./utils')

const typesAllowed = ['email/news', 'email/password', 'email/movie']

const templateRender = app => {
  return utils.asyncUse(async (req, res, next) => {
    const sparams = app.template.stringToSparams(req.query.sparams || '')
    if (typesAllowed.indexOf(sparams.f) !== -1) {
      const html = await app.template.render(sparams.f, sparams.d || {})
      res.contentType('html')
      return res.send(html)
    }
    res.redirect('/')
  })
}

module.exports = templateRender
