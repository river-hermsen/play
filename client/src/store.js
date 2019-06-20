import Vue from "vue";
import Vuex from "vuex";
import VuexPersist from "vuex-persist";

Vue.use(Vuex);
const vuexPersist = new VuexPersist({
  key: "my-app",
  storage: localStorage
});

var Cookies = require("js-cookie");

export default new Vuex.Store({
  plugins: [vuexPersist.plugin],
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
      genres: [],
      mostPopular: []
    }
  },
  getters: {
    getGenres: state => {
      return state.podcasts.genres;
    },
    getMostPopularPodcasts: state => {
      return state.podcasts.mostPopular;
    },
    getGenreTitleById: state => id => {
      // console.log(state.podcasts.genres.find(genre => (genre.id = id)));

      return state.podcasts.genres.find(genre => (genre.id = id));
    }
  },
  mutations: {
    addGenres(state, data) {
      state.podcasts.genres = data.genres;
      // console.log(state.podcasts.genres);
    },
    addMostPopularPodcasts(state, data) {
      state.podcasts.mostPopular.push(data);
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
