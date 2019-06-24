const getters = {
  getGenres: state => {
    return state.podcasts.genres;
  },
  getMostPopularPodcasts: state => {
    return state.podcasts.mostPopular;
  },
  getGenreTitleById: state => id => {
    return state.podcasts.genres.find(genre => genre.id === id);
  },
  getRandomGenre: state => {
    var genres = state.podcasts.genres;
    var randomGenre = genres[Math.floor(Math.random() * genres.length)];
    return randomGenre;
  },
  getIsLoggedInStatus: state => {
    return state.isloggedin;
  }
};

export default getters;
