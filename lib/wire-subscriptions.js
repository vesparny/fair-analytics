const brcast = require('brcast')

module.exports = function createSubscriptions (sse) {
  const broadcast = brcast()

  broadcast.subscribe(data => {
    sse.send({
      event: 'fair-analytics',
      data
    })
  })

  return broadcast
}
