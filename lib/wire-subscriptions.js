const brcast = require('brcast')

module.exports = function createSubscriptions (sse, db) {
  const broadcast = brcast()

  broadcast.subscribe(data => {
    sse.send({
      event: 'fair-analytics',
      data
    })
  })

  broadcast.subscribe(data => {
    sse.send({
      event: 'fair-analytics',
      data
    })
  })

  broadcast.subscribe(data => {
    db.storeEvent(data)
  })

  return broadcast
}
