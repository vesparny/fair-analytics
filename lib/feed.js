const hypercore = require('hypercore')
const swarm = require('hyperdiscovery')

module.exports = function createFeed (datasetPath) {
  const feed = hypercore(datasetPath, { valueEncoding: 'json' })
  feed.on('ready', () => {
    const sw = swarm(feed)
    sw.on('connection', (peer, type) => {
      console.log('connected to', sw.connections.length, 'peers')
      peer.on('close', () => console.log('peer disconnected'))
    })
  })
  return feed
}
