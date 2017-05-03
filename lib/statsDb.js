const low = require('lowdb')
const enqueue = require('enqueue')
const path = require('path')

module.exports = function createStatsDb (storageDirectory, inMemory) {
  console.log(storageDirectory)
  let db
  const file = storageDirectory
    ? path.resolve(storageDirectory, 'stats.json')
    : null
  inMemory
    ? (db = low())
    : (db = low(file, {
      storage: require('lowdb/lib/storages/file-async')
    }))

  db.defaults({ data: {} }).write()

  function storeEvent (event, done) {
    try {
      const { e, p, d } = event
      const dbEvent = db.get(`data.${e}`).value() || {}
      if (!dbEvent[p]) dbEvent[p] = {}
      dbEvent[p].times = dbEvent[p].times ? dbEvent[p].times + 1 : 1
      dbEvent[p].last = new Date(d).toISOString()
      db.set(`data.${e}`, dbEvent).write().then(done).catch(e => {
        console.log(e)
        done()
      })
    } catch (e) {
      console.log(e)
      done()
    }
  }
  return {
    storeEvent: enqueue(storeEvent),
    getAll: () => db.get('data').value()
  }
}
