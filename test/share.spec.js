const test = require('ava')
const shareFeed = require('../lib/share')
const createFeed = require('../lib/feed')

test.cb('shares with the  world:))))', t => {
  const feed = createFeed(null, true)
  feed.on('ready', () => {
    shareFeed(feed)
    t.end()
  })
})
