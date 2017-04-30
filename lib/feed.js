const hypercore = require('hypercore')
const ram = require('random-access-memory')

module.exports = function createFeed (datasetPath, memory) {
  return hypercore(memory ? ram : datasetPath, {
    valueEncoding: 'json'
  })
}
