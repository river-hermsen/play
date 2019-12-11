import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    genres: [],
    player: {
      isPlaying: false,
      audioTrack: 'https://www.listennotes.com/e/p/ec7eff6b8e7347c9affd894b1f06a123/'
    }
  },
  getters: {
    getGenres: state => {
      return state.genres
    },
    getGenreById (state, genreId) {
      return genreId
    },
    getPlayerInfo (state) {
      return state.player
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
