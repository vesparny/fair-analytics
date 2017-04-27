const micro = require('micro')
const cors = require('micro-cors')({ allowMethods: ['POST'] })
const url = require('url')
const { json, send, sendError } = micro
const getFeed = require('./feed').get

async function storeLog (rawBody) {
  return new Promise((resolve, reject) =>
    getFeed().append(rawBody, err => (err ? reject(err) : resolve()))
  )
}

async function postHandler (req, res) {
  const body = await json(req)
  await storeLog(body)
  send(res, 204)
}

async function getHandler (req, res) {
  const { pathname } = url.parse(req.url)
  if (pathname === '/favicon.ico') {
    send(res, 204)
    return
  }
  return getFeed().discoveryKey.toString('hex')
}

async function handler (req, res) {
  try {
    switch (req.method) {
      case 'POST':
        return await cors(postHandler)(req, res)
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

const createServer = () =>
  micro(async (req, res) => {
    try {
      return await handler(req, res)
    } catch (err) {
      sendError(req, res, err)
    }
  })

module.exports = createServer
