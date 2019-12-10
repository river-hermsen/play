import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    genres: []
  },
  getters: {
    getGenres: state => {
      return state.genres
    },
    getGenreById (state, genreId) {
      return genreId
    }
  },
  mutations: {
    setGenres (state, genres) {
      state.genres = genres
    }
  },
  actions: {
  }
})
