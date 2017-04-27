const hypercore = require('hypercore')

let feed

module.exports = {
  create: function create (datasetPath) {
    feed = hypercore(datasetPath, { valueEncoding: 'json' })
    return feed
  },
  get: function get () {
    return feed
  }
}
