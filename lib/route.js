const { sendError, send } = require('micro')
const url = require('url')

module.exports = function route (routes) {
  const availablePaths = Object.keys(routes)
  return async (req, res) => {
    const { pathname } = url.parse(req.url)
    if (availablePaths.indexOf(pathname) === -1) {
      return send(res, 404, `${req.method} ${req.url} Not Found`)
    }
    if (!routes[pathname][req.method]) {
      return send(res, 405, `Method Not Allowed`)
    }
    try {
      return await routes[pathname][req.method](req, res)
    } catch (err) {
      console.log(err.stack)
      if (err.statusCode === 400) {
        sendError(req, res, err)
        return
      }
      send(res, 500, 'Internal Server Error')
    }
  }
}
