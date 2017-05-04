module.exports = key => {
  return `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="description" content="Fair Analytics">
    <title>📊 Fair Analytics</title>
    <style type="text/css">
      html, body {
        margin: 0;
        padding: 0;
        border: 0;
        font-size: 100%;
        font: inherit;
        vertical-align: baseline;
      }
      body {
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
      }
      a {
        color: #0366d6;
        text-decoration: none;
        }
      pre {
        border: 1px solid rgb(234, 234, 234);
        padding: 3px;
        margin: 40px 0px;
        white-space: pre;
        overflow: auto;
      }
      code {
        color: tomato;
        font-size: 13px;
        line-height: 20px;
      }
      #root {
        padding: 10px;
      }
      .tac {
        text-align: center;
      }
    </style>
  </head>
  <body>
    <div id='root'>
      <h1>📊  Fair Analytics</h1>
      <ul>
        <li><a href="https://github.com/vesparny/fair-analytics">Fair Analytics source code</a></li>
        <li><a href="https://github.com/vesparny/fair-analytics/#readme">Fair Analytics complete documentation</a></li>
      </ul>
      <div><h3>The public key for accessing  raw data tracked by this instance is:</h3></div>
      <hr>
      <div><b>${key}</b></div>
      <hr>
        <b>Example: </b>
          <pre>
            <code>
// replicate the feed to another one
// useful when you want to store raw data to another machine
// or if you want to process it somehow (like storing it to another database)
const hyperdrive = require('hypercore')
const swarm = require('hyperdiscovery')
const KEY = '${key}'
const LOCALPATH = './replicated.dataset'

const feed = hyperdrive(LOCALPATH, KEY, {valueEncoding: 'json'})
swarm(feed)

feed.on('ready', () => {
  // this configuration will download all the feed
  // and process new incoming data
  // via the feed.on('data') callback
  // in case you want to process all the feed (old and new)
  // use only {tail: true, tail: true}
  feed.createReadStream({
    tail: true,
    live: true,
    start: feed.length,
    snapshot: false
  })
  .on('data', console.log)
})
            </code>
          </pre>
          <b>Then run it: </b>
            <pre>
              <code>
    node replicate.js
              </code>
            </pre>
            <hr>
              <div class='tac'>with ❤️  from <a href="https://twitter.com/vesparny">@vesparny</a></div>
    </div>
  </body>
</html>
`
}
