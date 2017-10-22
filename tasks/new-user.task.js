const requestRecoverPassword = require('../server/auth').requestRecoverPassword

async function newUser (app, parameters) {
  let email = parameters.email

  if (email) {
    email = email.trim().toLowerCase()
  }

  if (!email || !parameters.name) {
    throw new Error('You must provide an email and a name')
  }

  let currentUser = null
  try {
    currentUser = await app.mongo.getOne('user', { email: email })
  } catch (err) {
  }
  if (currentUser) {
    throw new Error('This email is already used')
  }

  const user = {
    name: parameters.name,
    email: email,
    password: '',
    genres: parameters.genres || [28, 12, 35, 80, 18, 10749, 878, 53],
    watchLater: [],
    ignored: [],
    notifications: {
      updatesNews: true,
      inTheatres: true,
      canBeDownloaded: true,
      movieChanges: true
    }
  }

  await app.mongo.insert('user', user)
  await requestRecoverPassword(app, user.email, true)

  return { name: parameters.name, email }
}

module.exports = newUser
