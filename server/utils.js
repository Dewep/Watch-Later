const asyncUse = proxy => (req, res, next) => {
  try {
    proxy(req, res, next).catch(next)
  } catch (err) {
    next(err)
  }
}

module.exports.asyncUse = asyncUse
