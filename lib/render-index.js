module.exports = key => {
  return `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>Fair Analytics</title>
  </head>
  <body>
    <div>
      <h1>Fair Analytics</h1>
      <ul>
        <li><a href="https://github.com/vesparny/fair-analytics">Fair Analytics source code</a></li>
        <li><a href="https://github.com/vesparny/fair-analytics/#readme">Fair Analytics complete documentation</a></li>
      </ul>
      The public key for accessing  raw data tracked by this instance is:
    <hr>
      <b>${key}</b>
      <hr>
    </div>
    <b>Example: </b>
      <pre>
        <code>
// replicate.js
const hyperdrive = require('hypercore')
const swarm = require('hyperdiscovery')
const KEY = '${key}'
const LOCALPATH = './replicated.dataset'

const feed = hyperdrive(LOCALPATH, KEY, {live: true, valueEncoding: 'json'})
swarm(feed)

feed
  .createReadStream({tail: true, live: true})
  .on('data', console.log)
        </code>
      </pre>
      <b>Then run it: </b>
        <pre>
          <code>
node replicate.js
          </code>
        </pre>
        <hr>
          with ❤️  from <a href="https://twitter.com/vesparny">@vesparny</a>
  </body>
</html>
`
}
