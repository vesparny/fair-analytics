const test = require('ava')
const td = require('testdouble')
const createSubscriptions = require('../lib/wire-subscriptions')

test.cb('invokes sse.send() when handler is called', t => {
  const sse = td.object({
    send: () => {}
  })
  const db = td.object({
    storeEvent: () => {}
  })
  const broadcast = createSubscriptions(sse, db)
  const data = 'wowowowwww'
  broadcast.setState(data)
  td.verify(sse.send({ event: 'fair-analytics', data }))
  td.verify(db.storeEvent(data))
  t.end()
})
