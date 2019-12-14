<template>
  <div>
    <div class="header-container" v-if="!isLoading">
      <h1>Best podcasts of {{genre.name}}</h1>
    </div>
    <div class="podcasts row">
      <div class="col-md-6" v-for="podcast in bestPodcasts" :key="podcast.id">
        <PodcastCard
          :title="podcast.title"
          :mainGenre="genre.name"
          :thumbnail="podcast.thumbnail"
          :podcastId="podcast.id"
        />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.header-container {
  margin-bottom: 2rem;
  h1 {
    font-size: 1.8rem;
  }
}
</style>

<script>
import PodcastCard from '../components/PodcastCard';
import axios from 'axios';

export default {
  name: 'Genre',
  components: { PodcastCard },
  data () {
    return {
      isLoading: true,
      genre: {},
      genres: [],
      bestPodcasts: []
    };
  },
  created () {
    this.$Loading.start();

    let genreName = this.$route.params.name;
    this.genres = this.$store.getters.getGenres;

    let genreObj = this.genres.find(genre => genre.name === genreName);

    if (!genreObj) {
      this.$router.push('/browse');
    } else {
      this.genre = genreObj;
      console.log(genreObj);
    }
  },
  beforeMount () {
    axios
      .get(
        `https://listen-api.listennotes.com/api/v2/best_podcasts?genre_id=${this.genre.id}`,
        {
          headers: { 'X-ListenAPI-Key': '2e2c4f39b7b44659b73cb3b31f95236e' }
        }
      )
      .then(response => {
        console.log(response.data);
        this.bestPodcasts = response.data.podcasts;
        this.$Loading.finish();
        this.isLoading = false;
      })
      .catch(function (error) {
        console.log(error);
      });
  }
};
</script>
