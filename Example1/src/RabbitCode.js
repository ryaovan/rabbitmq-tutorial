import * as amqp from 'amqplib';

export const RABBIT_CONNECTION = 'amqp://rabbitmq:5672';
let conn = null;

// init connection, restart on failure
export async initRabbit() {
  try {
    conn = await amqp.connect(RABBIT_CONNECTION);
    console.log('initRabbit - connect successful');
  } catch (err) {
    console.log(`initRabbit - connect error: ${err}`);
    setTimeout(() => {
      initRabbit();
      clearTimeout();
    }, 5000);
    return;
  }
}

// creates a consumer queue of the exchange
export async function consumer(ex) {
  try {
    const ch = conn.createChannel();
    await ch.assertExchange(ex, 'fanout', { durable: false });
    const q = await ch.assertQueue('', { durable: false });
    await ch.bindQueue(q.queue, ex, '');
    await ch.consume(
      q.queue,
      (msg) => {
        if (msg.content) console.log(`consumer - msg: ${msg.content}`);
      },
      { noAck: true },
    );
  } catch (err) {
    console.log(`consumer - err: ${err}`);
  }
}

// sends a message to an exchange
export async function sendMsg(ex, msg) {
  try {
    // create channel
    const ch = await conn.createChannel();
    // check exchange and publishes to it
    await ch.assertExchange(ex, 'fanout', { durable: false });
    await ch.publish(ex, '', Buffer.from(msg), { persistent: false });
    console.log(`sendMsg - sent: ${msg}`);
  } catch (err) {
    console.log(`sendMsg - error: ${err}`);
  }
}


