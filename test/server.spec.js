const test = require('ava')
const td = require('testdouble')
const request = require('request-promise')
const listen = require('test-listen')
const utils = require('./utils')
const createServer = require('../lib/server')

const getUrl = (
  feed = utils.getMockedFeed(),
  broadcast = utils.getMockedBroadcast(),
  sse = utils.getMockedSse()
) => {
  return listen(createServer(feed, broadcast, sse))
}

test('should send empty response on /favicon.ico', async t => {
  const url = await getUrl()
  t.falsy(await request(`${url}/favicon.ico`))
})

test('should send todo on /_stats', async t => {
  const url = await getUrl()
  t.is(await request(`${url}/_stats`), 'todo')
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
  const payload = { some: 'payload' }
  const params = {
    resolveWithFullResponse: true,
    body: payload,
    json: true
  }
  const res = await request.post(`${url}/`, params)
  td.verify(broadcast.setState(payload))
  t.is(res.statusCode, 204)
  t.falsy(res.body)
})

test('should send 500 in case of failure when storing log', async t => {
  const feed = utils.getMockedFeedThatFailsOnAppend()
  const url = await getUrl(feed)
  const params = {
    resolveWithFullResponse: true,
    body: {
      some: 'payload'
    },
    json: true
  }
  try {
    await request.post(`${url}/`, params)
  } catch (e) {
    t.is(e.statusCode, 500)
  }
})

test('should send 500 in case of invalid JSON', async t => {
  const url = await getUrl()
  const params = {
    resolveWithFullResponse: true
  }
  try {
    await request.post(`${url}/`, params)
  } catch (e) {
    t.is(e.statusCode, 500)
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
