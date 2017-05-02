const path = require('path')
const brcast = require('brcast')
const createFeed = require('./feed')
const createServer = require('./server')
const shareFeed = require('./share')
const sse = require('./sse')

const broadcast = brcast()

broadcast.subscribe(data => {
  sse.send({
    event: 'fair-analytics',
    data
  })
})

module.exports = function fa (flags) {
  const feed = createFeed(path.resolve(flags.s, 'feed'))
  feed.on('ready', shareFeed.bind(null, feed))
  const server = createServer(feed, broadcast, sse)
  server.feed = feed
  return server
}
