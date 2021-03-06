import Vue from 'vue';
import ElementUI from 'element-ui';
import './assets/scss/element-variables.scss';

import App from './App.vue';
import './registerServiceWorker';
import router from './router';
import store from './store';

Vue.use(ElementUI);
Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
