import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);
var Cookies = require("js-cookie");

export default new Vuex.Store({
  state: {
    isLoggedIn: Cookies.get("user") ? true : false,
    user: {
      token: "",
      username: "",
      email: ""
    },
    flashMsg: {
      error: {
        msg: ""
      },
      success: {
        msg: ""
      },
      info: {
        msg: ""
      }
    },
    podcasts: {
      genres: []
    }
  },
  mutations: {
    addGenres(state, genres) {
      state.podcasts.genres = genres;
      console.log(state.podcasts.genres);
    }
  },
  actions: {
    getUserInfo() {
      if (Cookies.get("user")) {
        const userInfo = JSON.parse(Cookies.get("user"));
        return {
          username: userInfo.username,
          email: userInfo.email
        };
      } else {
        return false;
      }
    },
    logInUser({ state }, userData) {
      console.log(state);
      console.log(userData);

      Cookies.set(
        "user",
        {
          jwt: userData.token,
          username: userData.username,
          email: userData.email
        },
        { expires: 7 }
      );
    },
    logOutUser() {
      Cookies.remove("user");
    }
  }
});
