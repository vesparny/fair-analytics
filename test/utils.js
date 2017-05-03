const td = require('testdouble')

module.exports.getMockedBroadcast = () =>
  td.object({
    setState: () => {}
  })

module.exports.getMockedSse = () =>
  td.object({
    addClient: () => {}
  })

module.exports.getMockedFeed = () => {
  return {
    key: '___key___',
    append: (data, cb) => cb()
  }
}

module.exports.getMockedFeedThatFailsOnAppend = () => {
  return {
    key: '___key___',
    append: (data, cb) => cb(new Error('boom'))
  }
}

module.exports.getMockedStatsDb = () =>
  td.object({
    getAllEvents: () => ({}),
    storeEvent: () => {}
  })
