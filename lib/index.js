const fa = require('./fair-analytics')

module.exports = function run (flags) {
  const server = fa(flags)
  const { feed } = server

  feed.on('ready', () => {
    server.listen(flags.port)
    console.log(
      '⚡ fair-analytics listening on ' + flags.host + ':' + flags.port + ' ⚡'
    )
  })
}
