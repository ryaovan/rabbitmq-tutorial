import {
  initRabbit, createExchange, setupConsumer, sendMsg, bindExchange,
} from './src/RabbitCode';

const ex = 'Router3';
const ex1 = 'KDS3';
const ex2 = 'OQB3';
const ex3 = 'Orders3';

const type1 = 'topic';
const type2 = 'fanout';

const routingPattern = 'KDS.OQB.Orders';
const bindPattern1 = 'KDS.*.*';
const bindPattern2 = '*.OQB.*';
const bindPattern3 = '#.Orders';
const consumerPattern = '';
const msg = 'Hello World!';
const q = '';

async function main() {
  // create connection to Rabbit
  const conn = await initRabbit();

  // create router exchange
  await createExchange(conn, ex, type1);

  // create fanout exchanges
  await createExchange(conn, ex1, type2);
  await createExchange(conn, ex2, type2);
  await createExchange(conn, ex3, type2);

  // bind fanout exchanges to router exchanges
  await bindExchange(conn, ex1, ex, bindPattern1);
  await bindExchange(conn, ex2, ex, bindPattern2);
  await bindExchange(conn, ex3, ex, bindPattern3);

  // create consumers
  await setupConsumer(conn, ex1, q, consumerPattern);
  await setupConsumer(conn, ex2, q, consumerPattern);
  await setupConsumer(conn, ex3, q, consumerPattern);

  // send msg once
  await sendMsg(conn, ex, msg, routingPattern);
}
main();
