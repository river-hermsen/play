const mutations = {
  addGenres(state, data) {
    state.podcasts.genres = data.genres;
  },
  addMostPopularPodcasts(state, data) {
    state.podcasts.mostPopular.push(data);
  }
};

export default mutations;
