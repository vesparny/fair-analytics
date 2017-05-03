const test = require('ava')
const createDb = require('../lib/stats-db')
const os = require('os')

test('should store an event', async t => {
  const db = createDb(null, true) // in memory
  const event = {
    e: 'mycustomEvent',
    p: '/',
    d: Date.now()
  }
  db.storeEvent(event)
  t.true(!!db.getAllEvents()[event.e])
  db.storeEvent(event)
  t.is(db.getAllEvents()[event.e][event.p].times, 2)
})

test.cb('should store an event on a file', t => {
  const db = createDb(os.tmpdir())
  const event = {
    e: 'mycustomEvent',
    p: '/',
    d: Date.now()
  }
  db.storeEvent(event)
  t.end()
})
