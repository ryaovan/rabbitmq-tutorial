import {
  initRabbit, createExchange, setupConsumer, sendMsg, bindExchange,
} from './src/RabbitCode';

const ex = 'Router2A';
const type = 'topic';
const routingPattern = 'KDS.OQB.Orders';
const bindPattern1 = 'KDS.*.*';
const bindPattern2 = '*.OQB.*';
const bindPattern3 = '#.Orders';

const msg = 'Hello World!';
const q = '';

async function main() {
  // create connection to Rabbit
  const conn = await initRabbit();
  // create exchanges
  await createExchange(conn, ex, type);
  // create consumers
  await setupConsumer(conn, ex, q, bindPattern1);
  await setupConsumer(conn, ex, q, bindPattern2);
  await setupConsumer(conn, ex, q, bindPattern3);
  // send msg once
  await sendMsg(conn, ex, msg, routingPattern);
}
main();
