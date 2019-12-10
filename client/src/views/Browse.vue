<template>
  <div id="browse">
    <div id="most-popular">
      <h1 class="header">Most popular Podcasts</h1>
      <div class="row at-row">
        <div class="col-md-6" v-for="podcast in podcasts.mostPopular" :key="podcast.id">
          <router-link :to="'podcast/' + podcast.id" tag="div">
            <at-card class="podcast-card">
              <div>
                <img style="width: 100%" :src="podcast.thumbnail" />
                <div style="padding: 6px;">
                  <span class="title">
                    <b>{{podcast.title}}</b>
                  </span>
                  <div class="extra-info">
                    <span class="genre">{{podcast.genreName}}</span>
                  </div>
                </div>
              </div>
            </at-card>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
#browse {
  .header {
    font-size: 1.6rem;
    margin-bottom: 1rem;
  }
  .podcast-card {
    height: 270px;
    margin-bottom: 6px;
    cursor: pointer;
    .title {
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
    .extra-info {
      position: absolute;
      bottom: 12px;
      width: 141px;
    }
  }
}
</style>

<script>
// eslint-disable-next-line semi
import axios from 'axios';

export default {
  name: 'Browse',
  data () {
    return {
      podcasts: {
        mostPopular: []
      }
    }
  },
  created () {
    console.log()

    if (this.$store.getters.getGenres.length === 0) {
      axios
        .get('https://listen-api.listennotes.com/api/v2/genres', {
          headers: { 'X-ListenAPI-Key': '2e2c4f39b7b44659b73cb3b31f95236e' }
        })
        .then(response => {
          this.$store.commit('setGenres', response.data.genres)
          console.log(this.$store.getters.getGenres.length)
        })
        .catch(function (error) {
          console.log(error)
        })
    }
  },
  mounted () {
    axios
      .get('https://listen-api.listennotes.com/api/v2/best_podcasts', {
        headers: { 'X-ListenAPI-Key': '2e2c4f39b7b44659b73cb3b31f95236e' }
      })
      .then(response => {
        console.log(response.data)

        var mostPopularArray = response.data.podcasts.slice(0, 8)
        var mostPopularArrayUpdated = mostPopularArray.filter(podcast => {
          var mainGenreId
          if (podcast.genre_ids[0] === 67) {
            mainGenreId = podcast.genre_ids[1]
          } else {
            mainGenreId = podcast.genre_ids[0]
          }
          return (podcast.genreName = this.$store.state.genres.find(
            genre => genre.id === mainGenreId
          ).name)
        })

        this.podcasts.mostPopular = mostPopularArrayUpdated
      })
      .catch(function (error) {
        console.log(error)
      })
  }
}
</script>
