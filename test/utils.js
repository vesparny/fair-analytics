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
