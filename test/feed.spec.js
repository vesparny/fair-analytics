const tape = require('tape')
const createFeed = require('../lib/feed')
const fs = require('fs')

tape('creates a feed on fs', t => {
  const feed = createFeed(require('os').tmpdir())
  feed.on('ready', t.end)
})

tape('creates a feed in memory', t => {
  const dir = './not-going-to-be-created'
  createFeed('./not-going-to-be-created', true)
  t.notOk(fs.existsSync(dir))
  t.end()
})
