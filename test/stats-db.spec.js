const test = require('ava')
const createDb = require('../lib/stats-db')
const os = require('os')

test('should store an event', async t => {
  const db = createDb(null, true) // in memory
  const ev = {
    event: 'mycustomEvent',
    pathname: '/',
    time: Date.now()
  }
  db.storeEvent(ev)
  console.log(db.getAllEvents())
  t.true(!!db.getAllEvents()[ev.event])
  db.storeEvent(ev)
  t.is(db.getAllEvents()[ev.event][ev.pathname].times, 2)
})

test.cb('should store an event on a file', t => {
  const db = createDb(os.tmpdir())
  const event = {
    event: 'mycustomEvent',
    pathname: '/',
    time: Date.now()
  }
  db.storeEvent(event)
  t.end()
})
