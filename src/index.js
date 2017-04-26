const micro = require('micro')
const hypercore = require('hypercore')
const url = require('url')
const swarm = require('hyperdiscovery')
const { send, json } = micro

const datasetPath = './my.dataset'
const feed = hypercore(datasetPath, { valueEncoding: 'json' })

function processNewEntry (entry) {
  // store the entry somewhere in another database
  console.log(entry)
}
const server = micro(async (req, res) => {
  const { pathname } = url.parse(req.url)
  const method = req.method

  if (method === 'GET' && pathname === '/') {
    send(
      res,
      200,
      `
      This will host the fancy frontend displaying collected data

      Discovery key: ${feed.key.toString('hex')}
      `
    )
    return
  }

  if (method === 'POST' && pathname === '/') {
    const data = await json(req)
    return new Promise((resolve, reject) => {
      feed.append(data, err => {
        if (err) reject(err)
        resolve(null)
      })
    })
  }

  send(res, 404, 'Not found')
})

feed.on('ready', () => {
  server.listen(3000)
  const sw = swarm(feed)
  sw.on('connection', function (peer, type) {
    console.log('connected to', sw.connections.length, 'peers')
  })
})

feed
  .createReadStream({
    tail: true,
    live: true
  })
  .on('data', processNewEntry)
  .on('end', console.log.bind(console, '\n(end)'))
