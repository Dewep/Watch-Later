const bcrypt = require('bcryptjs')

async function newUser (app, parameters) {
  if (!parameters.email || !parameters.password) {
    throw new Error('You must provide an email and a password')
  }

  const password = await new Promise(function (resolve, reject) {
    bcrypt.hash(parameters.password, 8, function (err, hash) {
      if (err) {
        reject(err)
      } else {
        resolve(hash)
      }
    })
  })

  const user = {
    email: parameters.email,
    password,
    genres: parameters.genres || [28, 12, 35, 80, 18, 10749, 878, 53],
    watchLater: [],
    ignored: []
  }

  await app.mongo.insert('user', user)
}

module.exports = newUser
