<template>
  <div id="home">
    <div id="most-popular">
      <h1 class="header">Most popular Podcasts</h1>
      <div class="row" v-if="isLoading">
        <el-row :gutter="16">
          <el-col :span="6" v-for="loadingCard in amountLoadingCards" :key="loadingCard">
            <LoadingPodcastCard />
          </el-col>
        </el-row>
      </div>

      <el-row :gutter="16">
        <el-col :span="6" v-for="podcast in podcasts.mostPopular" :key="podcast.id">
          <PodcastCard
            :title="podcast.title"
            :mainGenre="podcast.genreName"
            :thumbnail="podcast.thumbnail"
            :podcastId="podcast.id"
          />
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<style lang="scss" scoped>
#home {
  .header {
    font-size: 1.6rem;
    margin-bottom: 1rem;
  }
  .podcast-card {
    height: 280px;
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
import axios from 'axios';
import globalMixin from '../sevices/_helper';
import PodcastCard from '../components/PodcastCard.vue';
import LoadingPodcastCard from '../components/loading/LoadingPodcastCard.vue';

export default {
  name: 'Home',
  data() {
    return {
      isLoading: true,
      amountLoadingCards: 8,
      podcasts: {
        mostPopular: [],
      },
    };
  },
  components: { PodcastCard, LoadingPodcastCard },
  beforeCreate() {},
  mounted() {
    axios
      .get('https://listen-api.listennotes.com/api/v2/best_podcasts', {
        headers: { 'X-ListenAPI-Key': '2e2c4f39b7b44659b73cb3b31f95236e' },
      })
      .then((response) => {
        console.log(response.data);

        const mostPopularArray = response.data.podcasts.slice(0, 8);
        const mostPopularArrayUpdated = mostPopularArray.filter((podcast) => {
          const modifiedPodcast = podcast;
          let mainGenreId;
          // Check if genre is 'podcast' in that case get second genre in array
          if (podcast.genre_ids[0] !== 67) {
            [mainGenreId] = modifiedPodcast.genre_ids;
          } else {
            [, mainGenreId] = modifiedPodcast.genre_ids;
          }

          console.log(mainGenreId);

          this.isLoading = false;
          modifiedPodcast.genreName = globalMixin.methods.getGenreByID(
            mainGenreId,
          ).name;
          return modifiedPodcast;
        });

        this.podcasts.mostPopular = mostPopularArrayUpdated;
      })
      .catch((error) => {
        console.log(error);
      });
  },
};
</script>
