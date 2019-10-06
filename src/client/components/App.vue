<template>
  <div id="app">
    <h1>Vue Composition Chat</h1>
    <div class="chatroom">
      <div class="history">
        {{ history }}
        <div ref="bottomEl"></div>
      </div>
      <div class="inputWithButton">
        <input @keypress.enter="submit" type="text" v-model="text" placeholder="Enter to submit..." />
        <button @click="submit">submit</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { createComponent, ref, Ref, computed, watch } from '@vue/composition-api';

const WEB_SOCKET_URL = `${window.location.protocol === 'https:' ? 'wss' : 'ws'}://${window.location.host}`;

const useWS = <K>(url: string, defaultValue: K, transformData: (s: string) => K) => {
  const r: Ref<K> = ref(defaultValue) as any;

  const ws = new WebSocket(url);
  ws.addEventListener('message', ({ data }) => {
    r.value = transformData(data);
  });

  const send = (data: string) => ws.send(data);

  return { r, send };
};

export default createComponent({
  setup() {
    const { r: messages, send: sendMessage } = useWS<string[]>(WEB_SOCKET_URL, [], jsonString => {
      return JSON.parse(jsonString);
    });

    const bottomEl = ref<HTMLElement>(null);
    watch(messages, () => {
      if (!bottomEl.value) return;
      bottomEl.value.scrollIntoView();
    });

    const text = ref('');

    const submit = () => {
      if (text.value === '') return;
      sendMessage(text.value);
      text.value = '';
    };

    return {
      bottomEl,
      submit,
      text,
      history: computed(() => messages.value.join('\n')),
    };
  },
});
</script>

<style scoped>
#app {
  width: 100vw;
  max-width: 800px;
  margin: 0 auto;
}

.chatroom {
  display: grid;
  grid-template-rows: 1fr 2rem;
  height: 90vh;
}

.history {
  white-space: pre-line;
  overflow-y: scroll;
  overflow-x: auto;
  border: 1px solid black;
}

.inputWithButton {
  display: flex;
}

.inputWithButton input {
  flex-grow: 1;
}
</style>

<style>
@import 'normalize.css';

html {
  box-sizing: border-box;
}

*,
*::before,
*::after {
  box-sizing: inherit;
}

button {
  background: purple;
  color: white;
}
</style>
