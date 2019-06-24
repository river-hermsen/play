import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import VueRouter from "vue-router";

import store from "./store/index.js";
import "./assets/styles/reset.css";
import Element from "element-ui";
import "./assets/styles/element-variables.scss";

Vue.use(Element);
Vue.use(VueRouter);

Vue.config.productionTip = false;

new Vue({
  store,
  router,
  render: h => h(App)
}).$mount("#app");
