import Vue from 'vue';
import VueCompositionAPI from '@vue/composition-api';

import App from './components/App.vue';

Vue.use(VueCompositionAPI);

new Vue({
  el: '#app',
  render: h => h(App),
});
