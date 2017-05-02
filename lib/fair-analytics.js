const path = require('path')
const createFeed = require('./feed')
const createServer = require('./server')
const shareFeed = require('./share')
const createSubscriptions = require('./wire-subscriptions')
const sse = require('./sse')
const broadcast = createSubscriptions(sse)

module.exports = function fa (flags) {
  const sorageDir = flags.storageDirectory
    ? path.resolve(flags.storageDirectory, 'feed')
    : null
  const feed = createFeed(sorageDir, flags.memory)
  feed.on('ready', shareFeed.bind(null, feed))
  const server = createServer(feed, broadcast, sse)
  server.feed = feed
  return server
}
