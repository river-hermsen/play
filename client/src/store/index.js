import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    genres: [],
    player: {
      isPlaying: false,
      episode: {

      },
    },
  },
  getters: {
    getGenres: (state) => state.genres,
    getPlayerInfo(state) {
      return state.player;
    },
    getCurrentEpisode(state) {
      return state.player.episode;
    },
    getPlayingState(state) {
      return state.player.isPlaying;
    },
  },
  mutations: {
    setGenres(state, genres) {
      state.genres = genres;
    },
    setCurrentEpisode(state, episode) {
      state.player.episode = episode;
    },
    setIsPlaying(state, value) {
      state.player.isPlaying = value;
    },
    changePlayingState(state, value) {
      state.player.isPlaying = value;
    },
  },
  actions: {
  },
});
