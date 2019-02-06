import {
  initRabbit, createExchange, setupConsumer, sendMsg, bindExchange,
} from './src/RabbitCode';

/*
  TODO PART A CONFIG:
  1. madefine 1 exchange
  2. define exchange type
  2. define binding patterns
*/

/*
  TODO PART B CONFIG:
  1. define 4 exchanges
  2. define each exchange type
  3. define routing pattern
  4. define binding patterns
  5. define consumer pattern

*/

const msg = 'Hello World!';
const q = ''; // dynamically makes queues

async function main() {
  // create connection to Rabbit
  const conn = await initRabbit();

  /*
  TODO PART A:
    1. create 1 exchange
    2. create 3 consumers
  */

  /*
  TODO  PART B:
    1. create 1 topic exchange
    2. create 3 fanout exchanges
    3. bind 3 exchanges to router exchange
    4. create 3 consumers
    5. send msg
  */
  /*
    FUNCTIONS FOR YOUR REFERENCE:
      await createExchange(conn, ex, type);
      await setupConsumer(conn, ex, q, bindPattern);
      await sendMsg(conn, ex, msg, routingPattern);
      await bindExchange(conn, ex, ex, bindPattern);
  */

  // send msg once
  await sendMsg(conn, ex, msg, routingPattern);
}
main();
