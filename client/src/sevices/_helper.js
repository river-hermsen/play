import store from '../store/index'

export const globalMixin = {
  methods: {
    _getGenreByID (genreId) {
      if (genreId === 67) {
        return { name: null }
      } else {
        return store.state.genres.find(genre => genre.id === genreId)
      }
    },
    _msToDate (msTime) {
      return new Date(msTime)
    },
    _formatDate (date) {
      var dd = date.getDate()
      var mm = date.getMonth() + 1
      const yyyy = date.getFullYear()

      if (dd < 10) {
        dd = '0' + dd
      }
      if (mm < 10) {
        mm = '0' + mm
      }
      var formattedDate = dd + '/' + mm + '/' + yyyy
      return formattedDate
    },
    _formatTime (timeInSeconds) {
      return (timeInSeconds - (timeInSeconds %= 60)) / 60 + (timeInSeconds > 9 ? ':' : ':0') + timeInSeconds
    },
    _removeHTMLTags (string) {
      const noHTML = string.replace(/<\/?[^>]+(>|$)/g, '')
      return noHTML
    },
    // PLAYBACK methods
    _playEpisode (episode, podcastTitle) {
      episode.podcast_title = podcastTitle
      store.commit('setCurrentEpisode', episode)
    }
  }
}
