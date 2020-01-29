/* eslint-disable max-len */
import store from '../store/index';

const Store = require('electron-store');

const ElectronStore = new Store();

const monthsAbbreviations = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

export default {
  methods: {
    getGenreByID(genreId) {
      if (genreId === 67) {
        return { name: null };
      }
      return store.state.genres.find((genre) => genre.id === genreId);
    },
    msToDate(msTime) {
      return new Date(msTime);
    },
    formatDate(date, monthAbbreviation) {
      let dd = date.getDate();
      let mm;
      if (monthAbbreviation) {
        mm = monthsAbbreviations[date.getMonth()];
      } else {
        mm = date.getMonth() + 1;
      }
      const yyyy = date.getFullYear();
      if (dd < 10) {
        dd = `0${dd}`;
      }
      if (mm < 10) {
        mm = `0${mm}`;
      }
      const formattedDate = monthAbbreviation ? `${dd} ${mm} ${yyyy}` : `${dd}/${mm}/${yyyy}`;
      return formattedDate;
    },
    formatTime(timeInSeconds, format) {
      let modifiedTimeInSeconds = timeInSeconds;
      // Format time using MM:SS format
      if ((modifiedTimeInSeconds < (60 * 60) && format === undefined) || format === 'MM:SS') {
        const formattedTime = (modifiedTimeInSeconds - (modifiedTimeInSeconds %= 60)) / 60 + (modifiedTimeInSeconds > 9 ? ':' : ':0') + modifiedTimeInSeconds;
        return formattedTime;
      }

      // Format time using HH:MM:SS format
      const formattedTime = new Date(timeInSeconds * 1000).toISOString().substr(11, 8);
      return formattedTime;
    },
    removeHTMLTags(string) {
      const noHTML = string.replace(/<\/?[^>]+(>|$)/g, '');
      return noHTML;
    },
    debounce(func, wait, immediate) {
      let timeout;
      return () => {
        const context = this;
        // eslint-disable-next-line prefer-rest-params
        const args = arguments;
        const later = () => {
          timeout = null;
          if (!immediate) func.apply(context, args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
      };
    },
    // PLAYBACK methods
    playEpisode(episode) {
      const recentlyPlayedPodcasts = ElectronStore.get('recentlyPlayedPodcasts');
      if (recentlyPlayedPodcasts) {
        if (!recentlyPlayedPodcasts.includes(episode.podcastId)) {
          const recentAdded = recentlyPlayedPodcasts.concat(episode.podcastId);
          if (recentlyPlayedPodcasts.length >= 8) {
            recentAdded.shift();
          }
          ElectronStore.set('recentlyPlayedPodcasts', recentAdded);
        }
      } else {
        ElectronStore.set('recentlyPlayedPodcasts', [episode.podcastId]);
      }

      store.commit('setCurrentEpisode', episode);
    },
  },
};
