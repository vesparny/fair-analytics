const micro = require('micro')
const cors = require('micro-cors')({ allowMethods: ['POST'] })
const url = require('url')
const denodeify = require('denodeify')
const SseChannel = require('sse-channel')
const renderIndex = require('./render-index')

const sse = new SseChannel({
  cors: {
    origins: ['*']
  },
  jsonEncode: true
})
const { json, send, sendError } = micro

const createServer = feed => {
  const append = denodeify(feed.append.bind(feed))

  async function storeLog (rawBody) {
    // TODO: filter out not needed data
    const data = rawBody
    return append(data).then(() => {
      sse.send({
        event: 'fair-analytics',
        data
      })
    })
  }

  async function postHandler (req, res) {
    const body = await json(req)
    await storeLog(body)
    send(res, 204, null)
  }

  async function getHandler (req, res) {
    const { pathname } = url.parse(req.url)
    if (pathname === '/') {
      send(res, 200, renderIndex(feed.key.toString('hex')))
      return
    }
    if (pathname === '/favicon.ico') {
      send(res, 204, null)
      return
    }
    if (pathname === '/_live') {
      sse.addClient(req, res)
      return
    }
    if (pathname === '/_stats') {
      return 'todo'
    }
    send(res, 404, 'Not Found')
  }

  async function handler (req, res, feed) {
    try {
      switch (req.method) {
        case 'POST':
          return await cors(postHandler)(req, res, feed)
        case 'GET':
          return await getHandler(req, res)
        default:
          send(res, 405, 'Method Not Allowed')
          break
      }
    } catch (err) {
      throw err
    }
  }

  return micro(async (req, res) => {
    try {
      return await handler(req, res, feed)
    } catch (err) {
      sendError(req, res, err)
    }
  })
}

module.exports = createServer
