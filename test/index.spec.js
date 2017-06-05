const test = require('ava')
const fa = require('../lib')

test('returns an object with a feed and a listen properties', t => {
  const fairAnalytics = fa({
    memory: true
  })
  t.true(!!fairAnalytics.listen)
  t.true(!!fairAnalytics.feed)
})

test('returns an object with a feed and a listen properties creating the feed on disk', t => {
  const fairAnalytics = fa({
    memory: true,
    storageDirectory: 'whatever'
  })
  t.true(!!fairAnalytics.listen)
  t.true(!!fairAnalytics.feed)
})
