const swarm = require('hyperdiscovery')

module.exports = function share (feed) {
  const sw = swarm(feed)
  sw.on('connection', (peer, type) => {
    console.log('connected to', sw.connections.length, 'peers')
    peer.on('close', () => console.log('peer disconnected'))
  })
}
