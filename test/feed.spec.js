const test = require('ava')
const createFeed = require('../lib/feed')
const fs = require('fs')

test.cb('creates a feed on fs', t => {
  const feed = createFeed(require('os').tmpdir())
  feed.on('ready', t.end)
})

test('creates a feed in memory', t => {
  const dir = './not-going-to-be-created'
  createFeed('./not-going-to-be-created', true)
  t.falsy(fs.existsSync(dir))
})
