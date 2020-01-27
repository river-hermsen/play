<template>
  <div v-loading="isLoading">
    <div class="header-container" v-if="!isLoading">
      <h1>Best podcasts of {{regionName}}</h1>
    </div>
    <el-row class="podcasts" :gutter="16">
      <el-col :span="6" v-for="podcast in bestPodcasts" :key="podcast.id">
        <!-- eslint-disable-next-line max-len -->
        <PodcastCard :title="podcast.title" :thumbnail="podcast.thumbnail" :podcastId="podcast.id" />
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
  name: 'Region',
  components: { PodcastCard },
  data() {
    return {
      isLoading: true,
      regionName: '',
      regionCode: '',
      bestPodcasts: [],
    };
  },
  beforeMount() {
    this.regionName = this.$route.params.name;
    this.regionCode = this.$route.query.code;
    console.log(this.$route);
  },
  mounted() {
    axios
      .get(
        `https://listen-api.listennotes.com/api/v2/best_podcasts?region=${this.regionCode}`,
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
