import { ref, watch } from './reactivity';
import WebSocket from 'ws';
import nanoid from 'nanoid';
import Koa from 'koa';
import serve from 'koa-static';
import http from 'http';
import { resolve } from 'path';

const app = new Koa();
app.use(serve(resolve(__dirname, '../client')));
const server = http.createServer(app.callback());
const wss = new WebSocket.Server({ server });

type ClientId = string;
const websockets = ref<WebSocket[]>([]);
const messages = ref<string[]>([]);

watch([messages, () => websockets.value.length], ([messages]) => {
  for (const ws of websockets.value) {
    ws.send(JSON.stringify(messages));
  }
});

wss.on('connection', ws => {
  websockets.value.push(ws);

  const id: ClientId = nanoid();

  ws.on('message', message => {
    if (typeof message !== 'string') return;
    messages.value.push(`${id} said: ${message}`);
  });

  ws.on('close', () => {
    websockets.value = websockets.value.filter(socket => ws !== socket);
  });
});

const PORT = parseInt(process.env.PORT || '8080');
server.listen(PORT);
