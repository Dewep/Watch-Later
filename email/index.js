const request = require('request-promise')

class Email {
  constructor (config, app) {
    this.config = config
    this.app = app
  }

  async run () {
  }

  async sendEmail (to, subject, htmlContent, textContent) {
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
                Email: to
                // Name: "Passenger"
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
}

module.exports = Email
