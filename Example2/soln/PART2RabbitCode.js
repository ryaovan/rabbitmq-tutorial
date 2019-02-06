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

export async function bindExchange(conn, exDestination, exSource, pattern) {
  try {
    // create channel
    const ch = await conn.createChannel();
    // bind exchange
    await ch.bindExchange(exDestination, exSource, pattern);
    return;
  } catch (err) {
    throw new Error(`consumer - err: ${err}`);
  }
}

// const consumeFn = msg => console.log(`consumer | ex: ${msg.fields.exchange} | msg: ${msg.content}`);

// creates a consumer queue of the exchange
export async function setupConsumer(conn, ex, q, pattern) {
  try {
    // create channel
    const ch = await conn.createChannel();
    // create queue
    const { queue } = await ch.assertQueue(q);
    // bind queue to an exchange (follows type)
    await ch.bindQueue(queue, ex, pattern);
    // start consumer listener
    return ch.consume(
      queue,
      (msg) => {
        console.log(`consumer | ex: ${ex} | msg: ${msg.content}`);
      },
      { noAck: true },
    );
  } catch (err) {
    throw new Error(`consumer - err: ${err}`);
  }
}

// sends a message to an exchange
export async function sendMsg(conn, ex, msg, key) {
  try {
    // create channel
    const channel = await conn.createChannel();
    // send message once
    console.log(`------------------------------`);
    console.log(`publisher | msg: ${msg}`);
    console.log(`------------------------------`);
    await channel.publish(ex, key, Buffer.from(`${msg} ${new Date()}`));
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
    // be sure to run rabbitmq npm sfirst!
    console.log(`initRabbit - connect error: ${err}`);
    throw new Error(`err: ${err}`);
  }
}
