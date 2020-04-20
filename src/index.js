const async = require('async')
const Queue = require('./Queue')
const LnNode = require('./LN')
const config = require('../config.json')

const qu = new Queue(config.redis)

qu.init(null, (err) => {
  if (err) throw err
  async.each(config.lightning, (config, next) => {
    const node = new LnNode(config)
    node.on('invoice_updated', (invoice) => {
      qu.send(invoice)
    })
    next()
  })
  console.log('Listening to invoices')
})

process.on('uncaughtException', function (error) {
  console.log('UNCAUGHT EXCEPTION DETECTED')
  console.log(error)
  console.log('Restarting....')
})
