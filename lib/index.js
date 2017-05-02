const fa = require('./fair-analytics')

module.exports = function run (flags, cb) {
  const server = fa(flags)
  const { feed } = server

  feed.on('ready', () => {
    server.listen(flags.port)
    cb()
  })
}
