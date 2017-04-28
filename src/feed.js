const hypercore = require('hypercore')

module.exports = function createFeed (datasetPath) {
  return hypercore(datasetPath, { valueEncoding: 'json' })
}
