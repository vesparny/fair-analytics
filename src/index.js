const micro = require('micro')
const hypercore = require('hypercore')
const url = require('url')
const { send, json } = micro

const datasetPath = './dataset'
const feed = hypercore(datasetPath, { valueEncoding: 'utf-8' })

const server = micro(async (req, res) => {
  const { pathname } = url.parse(req.url)
  const method = req.method

  if (method === 'GET' && pathname === '/') {
    send(
      res,
      200,
      'This will host the fancy frontend displaying collected data'
    )
    return
  }

  if (method === 'POST' && pathname === '/') {
    const data = await json(req)
    return new Promise((resolve, reject) => {
      feed.append(`${JSON.stringify(data)}\n`, err => {
        if (err) reject(err)
        resolve(null)
      })
    })
  }

  send(res, 404, 'Not found')
})

feed.on('ready', () => server.listen(3000))
