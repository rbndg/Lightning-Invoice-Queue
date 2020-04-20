# Lightning-Invoice-Queue

Listen to lightning invoices from multiple LND and C-Lightning nodes and send to a redis queue for processing.
This is useful if you are managing multiple nodes and want to process the invoice payments.
This module pushes the `id` and `node_pub` of a paid invoice to a redis queue.

## How to run

1) git clone this repo
2) `npm install .`
3) Update `config.json.example`
4) `node lightning-invoice.js`

### How to read the queue
If you use [RSMQ](https://github.com/smrchy/rsmq) (Redis Simple Message Queue)

```
const rsmq = new RedisSMQ( {host: "127.0.0.1", port: 6379, ns: "Lightning-Invoice-Queue"} );
rsmq.receiveMessage({ qname: "invoice-queue" }, function (err, resp) {
	if (err) {
		console.error(err)
		return
	}
	if (resp.id) {
		console.log("new invoice paid! Now we process it!", resp)
	} else {
		console.log("No invoices for me...")
	}
});
```

#### C-Lightning
You need to setup [C-Lightning Websocket Plugin](https://github.com/rbndg/c-lightning-events) for C-Lightning, or any other C-Lightning websocket plugin.

#### LND
You need to have your `macaroon` and `tls` files update config.json with path
