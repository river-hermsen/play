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
    }
  },
  setters: {
    setGenres: (state, genres) => {
      console.log(state)
      console.log(genres)
    }
  }
})
