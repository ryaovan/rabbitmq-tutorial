import * as amqp from 'amqplib';

const { RABBIT_CONNECTION = 'amqp://localhost:5672' } = process.env;

// create single exchange
export async function createExchange(conn, ex, exType) {
  try {
    // create channel
    const ch = await conn.createChannel();
    // create exchange
    await ch.assertExchange(ex, exType, { durable: false });
    return;
  } catch (err) {
    throw new Error(`consumer - err: ${err}`);
  }
}

const consumeFn = msg => console.log(`consumer - msg: ${msg.content}`);

// creates a consumer queue of the exchange
export async function setupConsumer(conn, ex, q, key) {
  try {
    // create channel
    const ch = await conn.createChannel();
    // create queue
    const { queue } = await ch.assertQueue(q, { durable: false });
    // bind queue to an exchange (follows type)
    await ch.bindQueue(queue, ex, key);
    // start consumer listener
    return ch.consume(queue, consumeFn, { noAck: true });
  } catch (err) {
    throw new Error(`consumer - err: ${err}`);
  }
}

// sends a message to an exchange
export async function sendMsg(conn, ex, msg, key) {
  try {
    // create channel
    const channel = await conn.createChannel();
    // send message every interval
    setInterval(async () => {
      await channel.publish(ex, key, Buffer.from(`${msg} ${new Date()}`));
    }, 5000);
    console.log(`sendMsg - sent: ${msg}`);
    return;
  } catch (err) {
    throw new Error(`sendMsg - error: ${err}`);
  }
}

// init connection, restart on failure
export async function initRabbit() {
  try {
    // connect and return connection for other functions
    return await amqp.connect(RABBIT_CONNECTION);
  } catch (err) {
    // be sure to run rabbitmq first!
    console.log(`initRabbit - connect error: ${err}`);
    throw new Error(`err: ${err}`);
  }
}
