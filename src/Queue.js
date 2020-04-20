const { EventEmitter } = require('events')
const RedisSMQ = require('rsmq')

class Queue extends EventEmitter {
  constructor (op) {
    super()
    this.rsmq = new RedisSMQ({ host: op.host, port: op.port, ns: 'Lightning-Invoice-Queue' || op.ns })
  }

  init (name, cb) {
    this.qname = name || 'invoice-queue'
    this.rsmq.createQueue({ qname: this.qname }, function (err, resp) {
      if (err) {
        if (err.name === 'queueExists') return cb(null)
        return cb(err)
      }

      if (resp === 1) {
        cb(null)
      }
    })
  }

  send (data, cb) {
    this.rsmq.sendMessage({ qname: this.qname, message: JSON.stringify(data) }, (err, data) => {
      if (err) throw err
    })
  }
}
module.exports = Queue
