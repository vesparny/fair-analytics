const express = require('express')
const url = require('url')
const cors = require('cors')
const bodyParser = require('body-parser')
const HttpStatus = require('http-status-codes')
const renderIndex = require('./render-index')

function createError (code, msg) {
  const err = new Error(msg || HttpStatus.getStatusText(code))
  err.statusCode = code
  return err
}

const createServer = (feed, broadcast, sse, statsDb, origin = '*') => {
  const app = express()
  const corsMiddleware = cors({
    origin,
    optionsSuccessStatus: 200
  })
  app.use(bodyParser.json())

  function storeLog (rawData, cb) {
    const data = Object.assign(rawData, {
      time: Date.now()
    })
    return feed.append(data, err => {
      if (err) return cb(err)
      broadcast.setState(data)
      cb()
    })
  }

  app.get('/_live', (req, res) => {
    sse.addClient(req, res)
  })

  app.get('/_stats', (req, res) => {
    res.json(statsDb.getAllEvents())
  })

  app.get('/', (req, res) => {
    res.send(renderIndex(feed.key.toString('hex')))
  })

  app.options('/', corsMiddleware)
  app.post('/', corsMiddleware, (req, res, next) => {
    if (origin !== '*') {
      if (!req.headers.origin) return next(createError(403))
      const { host, hostname } = url.parse(req.headers.origin)
      if (host !== origin || hostname !== origin) return next(createError(403))
    }
    const body = req.body
    if (!body.event) return next(createError(400, '"event" is required'))
    if (!body.pathname) body.pathname = 'NO_PATHNAME'
    storeLog(body, err => {
      if (err) return next(err)
      res.status(204).send()
    })
  })

  app.use((req, res, next) => {
    const availablePaths = ['/', '/_stats', '/_live']
    const status = availablePaths.indexOf(req.path) > -1 ? 405 : 404
    throw createError(status)
  })

  app.use((err, req, res, next) => {
    console.error(err.stack)
    const status = err.statusCode || 500
    res
      .status(status)
      .send(status === 500 ? HttpStatus.getStatusText(status) : err.message)
  })

  return app
}

module.exports = createServer
