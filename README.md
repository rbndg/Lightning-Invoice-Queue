# Lightning-Invoice-Queue

Listen to lightning invoices from multiple LND and C-Lightning nodes and send to a redis queue for processing.
This is useful if you are managing multiple nodes and want to process the invoice payments.

## How to run

1) git clone this repo
2) `npm install .`
3) Update `config.json.example`
4) `node lightning-invoice.js`

#### C-Lightning
You need to setup [C-Lightning Websocket Plugin](https://github.com/rbndg/c-lightning-events) for C-Lightning, or any other C-Lightning websocket plugin.

#### LND
You need to have your `macaroon` and `tls` files update config.json with path
