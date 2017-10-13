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

  // middlewares
  app.use(bodyParser.json())
  app.use(bodyParser.text())

  const corsMiddleware = cors({
    origin,
    optionsSuccessStatus: 200
  })

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

  // routes
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
    if (req.body && typeof req.body === 'string') {
      try {
        req.body = JSON.parse(req.body)
      } catch (e) {
        return next(
          createError(
            400,
            'error parsing body, should be type json or JSON parsable text.'
          )
        )
      }
    }
    const body = req.body
    if (!body.event) return next(createError(400, '"event" is required'))
    if (!body.pathname) body.pathname = 'NO_PATHNAME'
    storeLog(body, err => {
      if (err) return next(err)
      res.status(204).send()
    })
  })

  app.get('/favicon.ico', (req, res) => res.sendStatus(204))

  // 404 and 405 handlers
  app.use((req, res, next) => {
    const availablePaths = ['/', '/_stats', '/_live']
    const status = availablePaths.indexOf(req.path) > -1 ? 405 : 404
    throw createError(status)
  })

  // error handler
  app.use((err, req, res, next) => {
    console.error(req.path)
    console.error(err.stack)
    const status = err.statusCode || 500
    res
      .status(status)
      .send(status === 500 ? HttpStatus.getStatusText(status) : err.message)
  })

  return app
}

module.exports = createServer
