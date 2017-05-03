const test = require('ava')
const td = require('testdouble')
const request = require('request-promise')
const listen = require('test-listen')
const utils = require('./utils')
const createServer = require('../lib/server')

const getUrl = (
  feed = utils.getMockedFeed(),
  broadcast = utils.getMockedBroadcast(),
  sse = utils.getMockedSse(),
  statsDb = utils.getMockedStatsDb(),
  origin = '*'
) => {
  return listen(createServer(feed, broadcast, sse, statsDb, origin))
}

test('should send 403 when POSTING from a not allowed origin and origin is not specified in headers', async t => {
  const url = await getUrl(
    utils.getMockedFeed(),
    utils.getMockedBroadcast(),
    utils.getMockedSse(),
    utils.getMockedStatsDb(),
    'another origin'
  )
  try {
    await request.post(`${url}/`, { resolveWithFullResponse: true })
  } catch (e) {
    t.is(e.statusCode, 403)
  }
})

test('should send 403 when POSTING from a not allowed origin', async t => {
  const url = await getUrl(
    utils.getMockedFeed(),
    utils.getMockedBroadcast(),
    utils.getMockedSse(),
    utils.getMockedStatsDb(),
    'another origin'
  )
  try {
    await request.post(`${url}/`, {
      resolveWithFullResponse: true,
      headers: { origin: 'another origin' }
    })
  } catch (e) {
    t.is(e.statusCode, 403)
  }
})

test('should send empty response on /favicon.ico', async t => {
  const url = await getUrl()
  t.falsy(await request(`${url}/favicon.ico`))
})

test('should send todo on /_stats', async t => {
  const url = await getUrl()
  await request(`${url}/_stats`)
  t.pass()
})

test('should send todo on /_live', async t => {
  const url = await getUrl()
  request(`${url}/_live`)
  t.true(true)
})

test("should send the feed's key on  /", async t => {
  const feed = utils.getMockedFeed()
  const url = await getUrl(feed)
  const body = await request(`${url}/`)
  t.true(body.includes(feed.key))
})

test('should send 405 for others http verbs', async t => {
  const url = await getUrl()
  try {
    await request.put(`${url}/`, { resolveWithFullResponse: true })
  } catch (e) {
    t.is(e.statusCode, 405)
  }
})

test('should send an empty response in case of succes when storing log and should invoke broadcast.setState() once', async t => {
  const feed = utils.getMockedFeed()
  const broadcast = utils.getMockedBroadcast()
  const url = await getUrl(feed, broadcast)
  const payload = { event: 'hello' }
  const params = {
    resolveWithFullResponse: true,
    body: payload,
    json: true
  }
  const res = await request.post(`${url}/`, params)
  t.is(td.explain(broadcast.setState).callCount, 1)
  t.is(res.statusCode, 204)
  t.falsy(res.body)
})

test('should send 500 in case of failure when storing log', async t => {
  const feed = utils.getMockedFeedThatFailsOnAppend()
  const url = await getUrl(feed)
  const params = {
    resolveWithFullResponse: true,
    body: {
      event: 'hello'
    },
    json: true
  }
  try {
    await request.post(`${url}/`, params)
  } catch (e) {
    t.is(e.statusCode, 500)
  }
})

test('should send 500 in case of missing "event" param', async t => {
  const feed = utils.getMockedFeedThatFailsOnAppend()
  const url = await getUrl(feed)
  const params = {
    resolveWithFullResponse: true,
    body: {
      aaaa: 'hello'
    },
    json: true
  }
  try {
    await request.post(`${url}/`, params)
  } catch (e) {
    t.is(e.statusCode, 400)
  }
})

test('should send 400 in case of invalid JSON', async t => {
  const url = await getUrl()
  const params = {
    resolveWithFullResponse: true
  }
  try {
    await request.post(`${url}/`, params)
  } catch (e) {
    t.is(e.statusCode, 400)
  }
})

test('should send 404', async t => {
  const url = await getUrl()
  const params = {
    resolveWithFullResponse: true
  }
  try {
    await request.get(`${url}/doesnotexist`, params)
  } catch (e) {
    t.is(e.statusCode, 404)
  }
})
