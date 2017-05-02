const test = require('ava')
const run = require('../lib')

test.cb('runs the server', t => {
  const cb = t.end
  run(
    {
      memory: true
    },
    cb
  )
})
