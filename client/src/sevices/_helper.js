import store from '../store/index'
import axios from 'axios'

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
    _formatTime (timeInSeconds, format) {
      if ((timeInSeconds < (60 * 60) & format === undefined) || format === 'MM:SS') {
        return (timeInSeconds - (timeInSeconds %= 60)) / 60 + (timeInSeconds > 9 ? ':' : ':0') + timeInSeconds
      } else {
        return new Date(timeInSeconds * 1000).toISOString().substr(11, 8)
      }
    },
    _removeHTMLTags (string) {
      const noHTML = string.replace(/<\/?[^>]+(>|$)/g, '')
      return noHTML
    },
    _debounce (func, wait, immediate) {
      var timeout
      return function () {
        var context = this; var args = arguments
        var later = function () {
          timeout = null
          if (!immediate) func.apply(context, args)
        }
        var callNow = immediate && !timeout
        clearTimeout(timeout)
        timeout = setTimeout(later, wait)
        if (callNow) func.apply(context, args)
      }
    },

    // PLAYBACK methods
    _playEpisode (episode, podcastTitle) {
      console.log(episode);

      episode.podcast_title = podcastTitle
      store.commit('setCurrentEpisode', episode)
    },
    _playRandomEpisode () {
      console.log('Playing random episode')

      axios
        .get('https://listen-api.listennotes.com/api/v2/just_listen', {
          headers: { 'X-ListenAPI-Key': '2e2c4f39b7b44659b73cb3b31f95236e' }
        })
        .then(response => {
          console.log(response)
        })
        .catch(function (error) {
          console.log(error)
        })
    }
  }
}
