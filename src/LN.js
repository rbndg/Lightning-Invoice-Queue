const { EventEmitter } = require('events')
const { readFileSync } = require('fs')
const async = require('async')
const WebSocket = require('ws')
const lns = require('ln-service')

const toB64 = (path) => readFileSync(path, { encoding: 'base64' })

class LightningNode extends EventEmitter {
  constructor (options) {
    super()
    if (options.type === 'LND') {
      this.listenToLND(options)
    }
    if (options.type === 'CLN') {
      this.listenToCLN(options)
    }
  }

  listenToCLN (config) {
    const ws = new WebSocket(config.host)

    ws.on('message', (data) => {
      const msg = JSON.parse(data)
      if (msg.invoice_payment) {
        console.log(msg.invoice_payment)
        this.emit('invoice_updated', {
          id: msg.invoice_payment.label,
          node_pub: config.node_pub
        })
      }
    })
    ws.on('error', (err) => {
      console.log(err)
    })
  }

  listenToLND (config) {
    let lnd
    try {
      lnd = lns.authenticatedLndGrpc({
        cert: toB64(config.cert),
        macaroon: toB64(config.macaroon),
        socket: config.socket
      }).lnd
    } catch (err) {
      console.log(err)
      return
    }

    async.waterfall([
      (next) => {
        lns.getWalletInfo({ lnd }, (err, result) => {
          next(err, result)
        })
      },
      (info, next) => {
        const sub = lns.subscribeToInvoices({ lnd })
        sub.on('invoice_updated', (invoice) => {
          if (!invoice.is_confirmed) return
          this.emit('invoice_updated', {
            node_pub: info.public_key,
            id: invoice.id
          })
        })
        sub.on('end', (err) => {
          this.emit('end', err)
        })
        sub.on('error', (err) => {
          console.log('Connectin to LND threw error ')
          console.log(err)
          this.emit('end', err)
        })
        next()
      }
    ])
  }
}

module.exports = LightningNode
