const test = require('ava')
const sse = require('../lib/sse')
const SseChannel = require('sse-channel')

test('exports a SseChannel instance', t => {
  t.true(sse instanceof SseChannel)
})
