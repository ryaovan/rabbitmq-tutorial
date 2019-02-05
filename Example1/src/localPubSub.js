import * as configs from '../config/config';
import storeConfig from './StoreConfig';
import orderJSON from './order';

// sends a storeconfig json to the storeConfig exchange
export async function sendStoreConfigToExchange(conn) {
  try {
    console.log('sendStoreConfigToExchange - connect successful');
    const ch = await conn.createChannel();
    const ex = configs.STORE_CONFIG_EXCHANGE;
    const q = await ch.assertQueue(`${ex}-${configs.DEVICE_NAME}`, { durable: true });
    const msg = JSON.stringify(storeConfig);

    await ch.assertExchange(ex, 'fanout', { durable: true });
    await ch.assertQueue(q.queue, { durable: true });
    await ch.bindQueue(q.queue, ex, '');
    await ch.publish(ex, '', Buffer.from(msg), { persistent: true });
    console.log(`sendStoreConfigToExchange - sent: ${msg}`);
  } catch (err) {
    console.log(`sendStoreConfigToExchangeToExchange - error: ${err}`);
  }
}

// sends an order json to the order exchange
export async function sendOrderToExchange(conn, ex) {
  console.log(`sendOrder - conn: ${conn}`);
  try {
    console.log('sendOrder - connect successful');
    const ch = await conn.createChannel();
    const msg = JSON.stringify(orderJSON);
    // check exchange and publishes to it
    await ch.assertExchange(ex, 'fanout', { durable: true });
    await ch.publish(ex, '', Buffer.from(msg), { persistent: true });
    console.log(`sendOrder - sent: ${msg}`);
  } catch (err) {
    console.log(`sendOrder - error: ${err}`);
  }
}

// creates a consumer queue of the exchange and logs incoming orders
export async function consumerOrder(conn, ex) {
  try {
    const ch = conn.createChannel();
    await ch.assertExchange(ex, 'fanout', { durable: true }); // exchage survives if broker restarts
    const q = await ch.assertQueue('', { durable: true });
    await ch.bindQueue(q.queue, ex, '');
    await ch.consume(
      q.queue,
      (msg) => {
        if (msg.content) console.log(`consumerOrder - order msg: ${msg.content}`);
      },
      { noAck: true },
    );
  } catch (err) {
    console.log(`consumerOrder - err: ${err}`);
  }
}
