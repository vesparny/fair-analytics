module.exports = key => {
  return `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>Open Web Traffic</title>
  </head>
  <body>
    <div>
      <h1>Open Web Traffic</h1>
      <ul>
        <li><a href="https://github.com/vesparny/owt">Open Web Traffic source code</a></li>
        <li><a href="https://github.com/vesparny/owt/#readme">Open Web Traffic complete documentation</a></li>
      </ul>
      The public key for accessing this site's web traffic data is:
    <hr>
      <b>${key}</b>
      <hr>
      <h3>You can use it to get a copy of the raw web traffic data tracked by this website ✌️</h3>
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
