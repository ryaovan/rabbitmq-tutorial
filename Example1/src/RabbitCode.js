export const RABBIT_CONNECTION = 'amqp://guest:guest@rabbitmq:5672';

import * as amqp from 'amqplib';

  // setup consumer for order and storeConfig
  async consumerSetup(ex) {
    const ch = await this.conn.createChannel();
    const queue = `${ex}-${DEVICE_NAME}`;
    await ch.assertExchange(ex, 'fanout', { durable: true }); // exchage survives if broker restarts
    const q = await ch.assertQueue(queue, { durable: true });
    await ch.bindQueue(q.queue, ex, '');
    await ch.consume(
      queue,
      msg => {
        if (msg.content) {
          // process store config
          if (ex === configs.STORE_CONFIG_EXCHANGE) {
            console.log(`consumerSetup - storeConfig: ${msg.content}`);
            this.processStoreConfig(JSON.parse(msg.content));
          } else {
            // process order (or other)
            console.log(`consumerSetup - order msg: ${msg.content}`);
            if (isValidOrderSchema(msg.content)) this.processOrder(JSON.parse(msg.content));
          }
        }
      },
      { noAck: true }
    );
  }

  // init connection, store conn
  async initRabbit() {
    try {
      this.conn = await amqp.connect(configs.RABBIT_CONNECTION);
      console.log('initRabbit - connect successful');
      console.log(`initRabbit - conn: ${this.conn}`);
    } catch (err) {
      console.log(`initRabbit - connect error: ${err}`);
      setTimeout(() => {
        this.initRabbit();
        clearTimeout();
      }, 5000);
      return;
    }

    if (IS_LOCAL_ENV) await this.localEnvSetup('emitStoreConfig');
    await this.consumerSetup(configs.STORE_CONFIG_EXCHANGE);
  }

  async localEnvSetup(exchange) {
    console.log('localEnvSetup - start');

    // send store config to a queue
    if (exchange === 'emitStoreConfig') {
      console.log('localEnvSetup - config consumer sent to exchange');
      await localPubSub.sendStoreConfigToExchange(this.conn);
    } else if (exchange === 'emitOrder') {
      await localPubSub.sendOrderToExchange(this.conn, this.router.topics.orders);
    }
    // else {
    //   localPubSub.consumerOrder(this.conn, exchange);
    // }
  }
}
