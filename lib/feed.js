const hypercore = require('hypercore')
const ram = require('random-access-memory')
const path = require('path')

module.exports = function createFeed (storageDirectory, inMemory) {
  const storageDir = storageDirectory
    ? path.resolve(storageDirectory, 'feed')
    : null
  return hypercore(inMemory ? ram : storageDir, {
    valueEncoding: 'json'
  })
}
