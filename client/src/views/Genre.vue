<template>
  <div v-loading="isLoading">
    <div class="header-container" v-if="!isLoading">
      <h1>Best podcasts of {{genre.name}}</h1>
    </div>
    <el-row class="podcasts" :gutter="16">
      <el-col :span="6" v-for="podcast in bestPodcasts" :key="podcast.id">
        <PodcastCard
          :title="podcast.title"
          :mainGenre="genre.name"
          :thumbnail="podcast.thumbnail"
          :podcastId="podcast.id"
        />
      </el-col>
    </el-row>
  </div>
</template>

<style lang="scss" scoped>
.header-container {
  margin-bottom: 2rem;
  h1 {
    font-size: 2rem;
  }
}
</style>

<script>
import axios from 'axios';
import PodcastCard from '../components/PodcastCard.vue';

export default {
  name: 'Genre',
  components: { PodcastCard },
  data() {
    return {
      isLoading: true,
      genre: {},
      genres: [],
      bestPodcasts: [],
    };
  },
  beforeMount() {
    const genreName = this.$route.params.name;
    this.genres = this.$store.getters.getGenres;
    console.log(this.$route);

    const genreObj = this.genres.find((genre) => genre.name === genreName);

    if (!genreObj) {
      this.$router.push('/browse');
    } else {
      this.genre = genreObj;
      console.log(genreObj);
    }
  },
  mounted() {
    console.log(
      `https://listen-api.listennotes.com/api/v2/best_podcasts?genre_id=${this.genre.id}`,
    );

    axios
      .get(
        `https://listen-api.listennotes.com/api/v2/best_podcasts?genre_id=${this.genre.id}`,
        {
          headers: { 'X-ListenAPI-Key': '2e2c4f39b7b44659b73cb3b31f95236e' },
        },
      )
      .then((response) => {
        console.log(response.data);
        this.bestPodcasts = response.data.podcasts;
        this.isLoading = false;
      })
      .catch((error) => {
        console.log(error);
      });
  },
};
</script>
