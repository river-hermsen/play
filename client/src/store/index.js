import Vue from "vue";
import Vuex from "vuex";
import VuexPersist from "vuex-persist";

import state from "./state.js";
import getters from "./getters";
import mutations from "./mutations";
import actions from "./actions";

Vue.use(Vuex);
const vuexPersist = new VuexPersist({
  key: "my-app",
  storage: localStorage
});

export default new Vuex.Store({
  // plugins: [vuexPersist.plugin],
  state,
  getters,
  mutations,
  actions
});
