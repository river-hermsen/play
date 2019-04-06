import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    isLoggedIn: false,
    user: {
      token: "",
      username: "",
      email: ""
    }
  },
  mutations: {
    newLogin(state, user) {
      state.user.token = user.token;
      state.user.username = user.username;
      state.user.email = user.email;
      state.isLoggedIn = true;
    }
  }
});
