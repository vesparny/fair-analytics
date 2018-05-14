# Fair Analytics

> An analytics server that doesn't undermine user's privacy

[![Travis](https://img.shields.io/travis/vesparny/fair-analytics.svg)](https://travis-ci.org/vesparny/fair-analytics)
[![Code Coverage](https://img.shields.io/codecov/c/github/vesparny/fair-analytics.svg?style=flat-square)](https://codecov.io/github/vesparny/fair-analytics)
[![David](https://img.shields.io/david/vesparny/fair-analytics.svg)](https://david-dm.org/vesparny/fair-analytics)
[![npm](https://img.shields.io/npm/v/fair-analytics.svg)](https://www.npmjs.com/package/fair-analytics)
[![npm](https://img.shields.io/npm/dm/fair-analytics.svg)](https://npm-stat.com/charts.html?package=fair-analytics&from=2017-04-01)
[![JavaScript Style Guide](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com/)
[![MIT License](https://img.shields.io/npm/l/fair-analytics.svg?style=flat-square)](https://github.com/vesparny/fair-analytics/blob/master/LICENSE)

## Motivations?

Google Analytics is the de-facto standard in the web and mobile analytics service world.

* It's easy to setup and start tracking users behaviors
* It provides advanced reporting features.

But it has several serious privacy implications:

* Most of the time personal data is collected without the explicit consent of the user, hence it undermines user's privacy
* It's closed-source
* It does not embrace transparency at all
* Users cannot access tracked data because data ownership is granted only to the website/app owner (and sadly to Google)
* It targets specific users and data collected is not anonymous

Inspired by an [interesting article](https://staltz.com/open-analytics.html) from [@staltz](https://github.com/staltz), and from the awesome work done by the [micro-analytics](https://github.com/micro-analytics/micro-analytics-cli) team, I decided to start working on a Google Analytics alternative.

## What is Fair Analytics

Fair Analytics is an open, transparent, distributed and fair Google Analytics alternative.

## Key features

* **Fair** - It's meant to provide lightweight and anonymous analytics about traffic and usage, not to track behaviors nor geographical locations of users
* **Distributed** - Raw traffic data is written in an append-only, secure, and distributed log. It uses [hypercore](https://github.com/mafintosh/hypercore) under the hood
* **Transparent** - Raw traffic data is accessible to anyone. This makes it auditable and gives back its ownership to the crowd
* **Easy** - It's easy to setup
* **Flexible** - Even though Fair Analytics only stores raw data, it's pretty easy to listen to incoming events, enabling the user to manipulate/aggregate raw data in order to provide graphs or charts. Get fancy if you want to.


## Setup

There are 2 ways of running Fair Analytics

### CLI

```bash
npm install -g fair-analytics

fair-analytics

```

The command accepts some options:

```bash
$ fair-analytics --help

  Usage: fair-analytics [options] [command]

  Commands:

    help  Display help

  Options:

    -h, --help                       Output usage information
    -H, --host [value]               Host to listen on (defaults to "0.0.0.0")
    -m, --memory                     Use in-memory storage (disabled by default)
    -o, --origin [value]             Accepts POST requests only from a specified origin (defaults to "*")
    -p, --port <n>                   Port to listen on (defaults to 3000)
    -s, --storage-directory [value]  Storage directory (defaults to process.cwd())
    -v, --version                    Output the version number
```

The instance is now running at `http://localhost:3000`

### Programmatically

Add fair-analytics as a dependency to your project

```js
const path = require('path')
const fa = require('fair-analytics')

const server = fa({
  storageDirectory: path.resolve(__dirname)
})
const { feed } = server

feed.on('ready', () => {
  server.listen(3000, '0.0.0.0')
})
```

The instance is now running at `http://localhost:3000`

## Deploy

TODO

* nginx
* docker


## Usage

### Track events

The quickest way to start tracking usage is to use [fair-analytics-client-api](https://github.com/vesparny/fair-analytics-client-api)

Example usage:

```js
import fairAnalytics from 'fair-analytics-client-api'

// create a fa instance
const fa = fairAnalytics({
  url: 'https://fa.yoursite.com' // the URL of your hosted Fair Analytics instance
})

// track events
fa.send({
  event: 'pageView', // event is mandatory and can be anything
  pathname: window.location.pathname
})
.then(res => {
  if (res.ok) {
    console.log('success')
  }
})
.catch(err => {
  console.error(err.message)
})
```

Please refer to the [fair-analytics-client-api documentation](https://github.com/vesparny/fair-analytics-client-api/#readme) for further details

### Endpoints

Fair Analytics responds to 3 endpoints:

##### GET /

Responds with a basic homepage, displaying the `feed.key`

##### POST /

Used to POST tracked events.
Responds with 204 in case of success (the body MUST be an object containing at least an `event` parameter)

##### GET /_live

Gets realtime updates via [server sent events](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events/Using_server-sent_events)
Useful to create real-time dashboards

Consuming real-time data is as easy as:

```js
if (window.EventSource) {
  const source = new window.EventSource('https://fa.mysite.com/_live')

  source.addEventListener('fair-analytics-event', (e) => {
    console.log(e)
  })

  source.addEventListener('open', () => {
    console.log('Connection was opened')
  })

  source.addEventListener('error', e => {
    if (e.readyState === window.EventSource.CLOSED) {
      console.log('Connection was closed')
    }
  })
}
```

##### GET /_stats

Provides an aggregated view of all the events stored, grouped by `event` and `pathname`
In this case data is persisted to a local JSON file using [lowdb](https://github.com/typicode/lowdb)

Here is an example response:

```json
{  
   "pageView":{  
      "/home":{  
         "times":640,
         "last":"2017-05-04T12:36:31.514Z"
      },
      "/about":{  
         "times":40,
         "last":"2017-05-04T12:36:31.514Z"
      }
   }
}
```

### Replicate raw data

As we said Fair Analytics is distributed.
It's easily possible to replicate raw data.

```js
const hypercore = require('hypercore')
const swarm = require('hyperdiscovery')
const KEY = 'A FAIR ANALYTICS FEEED KEY'
const LOCALPATH = './replicated.dataset'

const feed = hypercore(LOCALPATH, KEY, {valueEncoding: 'json'})
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
  .on('data', console.log) // Use this callback to precess data as you like
})
```

## Tests

```sh
$ npm test
```

## Change Log

This project adheres to [Semantic Versioning](http://semver.org/).  
Every release, along with the migration instructions, is documented in the [CHANGELOG.md](https://github.com/vesparny/fair-analytics/blob/master/CHANGELOG.md) file.

## License

MIT
