const createFeed = require('./feed')
const createServer = require('./server')
const shareFeed = require('./share')
const path = require('path')

module.exports = function fa (flags) {
  const feed = createFeed(path.resolve(flags.s, 'feed'))
  feed.on('ready', shareFeed.bind(null, feed))
  const server = createServer(feed)
  server.feed = feed
  return server
}
