const test = require('ava')
const createFeed = require('../lib/feed')
const fs = require('fs')
const os = require('os')
const path = require('path')

test.cb('creates a feed on fs', t => {
  const feed = createFeed(path.resolve(os.tmpdir(), Date.now() + 'feed'))
  feed.on('ready', t.end)
})

test('creates a feed in memory', t => {
  const dir = './not-going-to-be-created'
  createFeed('./not-going-to-be-created', true)
  t.falsy(fs.existsSync(dir))
})
