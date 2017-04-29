const createFeed = require('./feed')
const createServer = require('./server')

module.exports = function fa () {
  const datasetPath = './my.dataset'
  const feed = createFeed(datasetPath)
  const server = createServer(feed)
  server.feed = feed
  return server
}
