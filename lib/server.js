const micro = require('micro')
const cors = require('micro-cors')({ allowMethods: ['POST'] })
const denodeify = require('denodeify')
const renderIndex = require('./render-index')
const route = require('./route')

const { json, send } = micro

const createServer = (feed, broadcast, sse, statsDb) => {
  const append = denodeify(feed.append.bind(feed))

  async function storeLog (rawBody) {
    // TODO: filter out not needed data
    const data = rawBody
    data.d = Date.now()
    return append(data).then(() => broadcast.setState(data))
  }

  return micro(
    route({
      '/': {
        GET: async function (req, res) {
          send(res, 200, renderIndex(feed.key.toString('hex')))
        },
        POST: cors(async function postHandler (req, res) {
          const body = await json(req)
          await storeLog(body)
          send(res, 204, null)
        })
      },
      '/_live': {
        GET: async function (req, res) {
          sse.addClient(req, res)
        }
      },
      '/_stats': {
        GET: async function (req, res) {
          send(res, 200, statsDb.getAllEvents())
        }
      },
      '/favicon.ico': {
        GET: async function (req, res) {
          send(res, 204, null)
        }
      }
    })
  )
}

module.exports = createServer
