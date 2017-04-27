const swarm = require('hyperdiscovery')
const feed = require('./feed')
const createServer = require('./server')

const datasetPath = './my.dataset'
const archive = feed.create(datasetPath)
const server = createServer()

archive.on('ready', () => {
  server.listen(3000)
  const sw = swarm(archive)
  sw.on('connection', function (peer, type) {
    console.log('connected to', sw.connections.length, 'peers')
  })
})

archive
  .createReadStream({
    tail: true,
    live: true
  })
  .on('data', () => ({}))
  .on('end', console.log.bind(console, '\n(end)'))
