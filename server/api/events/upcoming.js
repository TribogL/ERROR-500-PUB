const app = require('../../index')

module.exports = (req, res) => {
  const query = req.url.includes('?')
    ? req.url.slice(req.url.indexOf('?'))
    : ''

  req.url = `/api/events/upcoming${query}`

  return app(req, res)
}