const createFeed = require('./feed')
const createServer = require('./server')
const shareFeed = require('./share')
const createSubscriptions = require('./wire-subscriptions')
const sse = require('./sse')
const createStatsDb = require('./statsDb')

module.exports = function fa (flags) {
  const statsDb = createStatsDb(flags.storageDirectory, flags.memory)
  const broadcast = createSubscriptions(sse, statsDb)
  const feed = createFeed(flags.storageDirectory, flags.memory)
  feed.on('ready', shareFeed.bind(null, feed))
  const server = createServer(feed, broadcast, sse, statsDb)
  server.feed = feed
  return server
}
