const swarm = require('hyperdiscovery')
const createFeed = require('./feed')
const createServer = require('./server')

const datasetPath = './my.dataset'
const feed = createFeed(datasetPath)
const server = createServer(feed)

feed.on('ready', () => {
  server.listen(3000)
  const sw = swarm(feed)
  sw.on('connection', (peer, type) => {
    console.log('connected to', sw.connections.length, 'peers')
    peer.on('close', () => console.log('peer disconnected'))
  })
})

feed
  .createReadStream({
    tail: true,
    live: true
  })
  .on('data', () => ({}))
  .on('end', console.log.bind(console, '\n(end)'))
