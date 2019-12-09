<template>
  <div id="browse">
    <div id="most-popular">
      <h1 class="header">Most popular Podcasts</h1>
      <div class="row at-row">
        <div class="col-md-6" v-for="podcast in podcasts.mostPopular" :key="podcast.id">
          <at-card class="podcast-card">
            <div>
              <img style="width: 100%" :src="podcast.image" />
              <div style="padding: 6px;">
                <p>
                  <b>{{podcast.title}}</b>
                </p>
                <div class="extra-info">
                  <span class="genre">Thriller</span>
                  <span class="language">English</span>
                </div>
              </div>
            </div>
          </at-card>
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
    .extra-info {
      position: absolute;
      bottom: 12px;
      width: 141px;
      .language {
        float: right;
      }
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
  beforeMount () {
    if (this.$store.getters.getGenres.length === 0) {
      axios
        .get('https://listen-api.listennotes.com/api/v2/genres', {
          headers: { 'X-ListenAPI-Key': '2e2c4f39b7b44659b73cb3b31f95236e' }
        })
        .then(response => {
          // console.log(response.data)
          this.$store.state.genres = response.data.genres
        })
      // .catch(function (error) {
      //   console.log(error)
      // })
    }
  },
  mounted () {
    // console.log(this.$store.state)
    axios
      .get('https://listen-api.listennotes.com/api/v2/best_podcasts', {
        headers: { 'X-ListenAPI-Key': '2e2c4f39b7b44659b73cb3b31f95236e' }
      })
      .then(response => {
        var mostPopularArray = response.data.podcasts.slice(0, 8)
        this.podcasts.mostPopular = mostPopularArray
      })
    // .catch(function (error) {
    //   console.log(error)
    // })
  }
}
</script>
