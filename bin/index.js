#!/usr/bin/env node

const pkg = require('../package')
const args = require('args')
const nodeVersion = require('node-version')
const isAsyncSupported = require('is-async-supported')
const updateNotifier = require('update-notifier')
const path = require('path')

if (nodeVersion.major < 6) {
  console.error(
    `Error! Micro requires at least version 6 of Node. Please upgrade!`
  )
  process.exit(1)
}

updateNotifier({ pkg }).notify()

args
  .option(['p', 'port'], 'Port to listen on', process.env.PORT || 3000, Number)
  .option(
    ['s', 'storage-directory'],
    'Storage directory',
    path.resolve(process.cwd())
  )
  .option(['H', 'host'], 'Host to listen on', '0.0.0.0')
  .option(
    ['o', 'origin'],
    'Accepts POST requests only from a specified origin',
    '*'
  )
  .option(['m', 'memory'], 'Use in-memory storage', false, Boolean)

const fa = isAsyncSupported() ? '../lib' : '../dist'
const flags = args.parse(process.argv, { name: pkg.name })
require(fa)(flags, () => {
  console.log(
    '⚡ fair-analytics listening on ' + flags.host + ':' + flags.port + ' ⚡'
  )
})
