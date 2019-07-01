const getters = {
  getGenres: state => {
    return state.podcasts.genres;
  },
  getMostPopularPodcasts: state => {
    return state.podcasts.mostPopular;
  },
  getGenreTitleById: () => (ids, genres) => {
    return genres.find(genre => {
      // Fix bug of genre name is Podcasts
      // Genre.id of Podcasts is 67
      if (ids[0] == 67) {
        return genre.id === ids[1];
      } else {
        return genre.id === ids[0];
      }
    });
  },
  getRandomGenre: state => {
    var genres = state.podcasts.genres;
    var randomGenre = genres[Math.floor(Math.random() * genres.length)];
    return randomGenre;
  },
  getIsLoggedInStatus: state => {
    return state.isloggedin;
  },
  getAudio: state => {
    return state.audioPlayer;
  }
};

export default getters;
