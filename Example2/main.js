import {
  initRabbit, createExchange, setupConsumer, sendMsg,
} from './src/RabbitCode';

const ex = 'KDS';
const type = 'direct';
const key = 'example2';
const msg = 'Hello World!';
const q = '';

async function main() {
  const conn = await initRabbit();
  await createExchange(conn, ex, type);
  await setupConsumer(conn, ex, q, key);
  await sendMsg(conn, ex, msg, key); // sends msg once
}

main();
