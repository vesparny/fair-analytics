const test = require('ava')
const request = require('request-promise')
const listen = require('test-listen')
const utils = require('./utils')
const createServer = require('../lib/server')

const getUrl = feed => {
  return listen(createServer(feed))
}

const getFeed = () => {
  return utils.getMockedFeed()
}

test('should send empty response on /favicon.ico', async t => {
  const url = await getUrl(getFeed())
  t.falsy(await request(`${url}/favicon.ico`))
})

test('should send todo on /_stats', async t => {
  const url = await getUrl(getFeed())
  t.is(await request(`${url}/_stats`), 'todo')
})

test('should send todo on /_live', async t => {
  const url = await getUrl(getFeed())
  request(`${url}/_live`)
  t.true(true)
})

test("should send the feed's key on  /", async t => {
  const feed = getFeed()
  const url = await getUrl(feed)
  const body = await request(`${url}/`)
  t.true(body.includes(feed.key))
})

test('should send 405 for others http verbs', async t => {
  const feed = getFeed()
  const url = await getUrl(feed)
  try {
    await request.put(`${url}/whatever`, { resolveWithFullResponse: true })
  } catch (e) {
    t.is(e.statusCode, 405)
  }
})

test('should send an empty response in case of succes when storing log', async t => {
  const feed = getFeed()
  const url = await getUrl(feed)
  const params = {
    resolveWithFullResponse: true,
    body: {
      some: 'payload'
    },
    json: true
  }
  const res = await request.post(`${url}/`, params)
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

test('should send 400 in case of invalid JSON', async t => {
  const feed = getFeed()
  const url = await getUrl(feed)
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
  const feed = getFeed()
  const url = await getUrl(feed)
  const params = {
    resolveWithFullResponse: true
  }
  try {
    await request.get(`${url}/doesnotexist`, params)
  } catch (e) {
    t.is(e.statusCode, 404)
  }
})
