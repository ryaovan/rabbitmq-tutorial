import {
  initRabbit, createExchange, setupConsumer, sendMsg,
} from './src/RabbitCode';

const ex = 'KDS';
const type = 'direct';
const key = 'example1';
const msg = 'Hello World!';

async function main() {
  const conn = await initRabbit();
  await createExchange(conn, ex, type);
  const consumer = await setupConsumer(conn, ex, key);
  await sendMsg(conn, ex, msg, key);
}
main();
