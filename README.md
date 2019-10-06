# Vue Composition Chat

POC of how backend can also leverage the power of Vue's reactivity.

## What to look?

The most interesting bit is probably in the file: `src/server/index.ts`.

```ts
import { ref, watch } from '@vue/reactivity';
import WebSocket from 'ws';
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
```

Notice as messages come in from the websocket, we simply push the message to the `messages` ref. And the watcher would take care of broadcasting messages for us. The watcher will also fire when new user connects to the server.

## Author

Jason Yu
