const low = require('lowdb')
const enqueue = require('enqueue')
const path = require('path')

module.exports = function createStatsDb (storageDirectory, inMemory) {
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

  function storeEvent (ev, done) {
    try {
      const { event, pathname, time } = ev
      const dbEvent = db.get(`data.${event}`).value() || {}
      if (!dbEvent[pathname]) dbEvent[pathname] = {}
      dbEvent[pathname].times = dbEvent[pathname].times
        ? dbEvent[pathname].times + 1
        : 1
      dbEvent[pathname].last = new Date(time).toISOString()
      const setFunc = db.set(`data.${event}`, dbEvent).write()
      if (setFunc.then) {
        setFunc.then(done).catch(e => {
          console.log(e)
          done()
        })
      } else {
        done()
      }
    } catch (e) {
      console.log(e)
      done()
    }
  }
  return {
    storeEvent: enqueue(storeEvent),
    getAllEvents: () => db.get('data').value()
  }
}
