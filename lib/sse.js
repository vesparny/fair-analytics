const SseChannel = require('sse-channel')

const sse = new SseChannel({
  cors: {
    origins: ['*']
  },
  jsonEncode: true
})

module.exports = sse
