const test = require('ava')
const shareFeed = require('../lib/shareFeed')

test.cb('shares with the  world:))))', t => {
  shareFeed()
  t.end()
})
