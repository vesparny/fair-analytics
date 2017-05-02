const test = require('ava')
const td = require('testdouble')
const createSubscriptions = require('../lib/wire-subscriptions')

test.cb('invokes sse.send() when handler is called', t => {
  const sse = td.object({
    send: () => {}
  })
  const broadcast = createSubscriptions(sse)
  const data = 'wowowowwww'
  broadcast.setState(data)
  td.verify(sse.send({ event: 'fair-analytics', data }))
  t.end()
})
