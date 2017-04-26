// just to try

const hyperdrive = require('hypercore')
const swarm = require('hyperdiscovery')

const feed = hyperdrive(
  './replicate.dataset',
  '01842485b8b40ca9de3995fe4e51d48c4b895e5903a9c37102aa11a40e7d88d5',
  { live: true, valueEncoding: 'json' }
)
swarm(feed)

feed
  .createReadStream({
    tail: true,
    live: true
  })
  .on('data', console.log)
  .on('end', console.log.bind(console, '\n(end)'))
