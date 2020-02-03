<template>
  <div>
    <div>
      <h1>Continue where you left off!</h1>
    </div>
    <div class="section" v-if="this.recentlyPlayedEpisodes">
      <h2>Episodes</h2>
      <div>
        <PodcastEpisode
          v-for="episode in results.episodes"
          :key="episode.id"
          :id="episode.id"
          :title="episode.title"
          :image="episode.image"
          :description="episode.description"
          :pubDate="episode.pub_date_ms"
          :audio="episode.audio"
          :audioLength="episode.audio_length_sec"
          :podcastTitle="episode.podcast_title"
          :podcastId="episode.podcast_id"
        />
      </div>
    </div>
    <div class="section" v-if="this.recentlyPlayedPodcasts">
      <h2>Podcasts</h2>
      <el-row :gutter="16">
        <el-col :span="6" v-for="podcast in results.podcasts" :key="podcast.id">
          <PodcastCard
            :title="podcast.title"
            :mainGenre="podcast.genreName"
            :thumbnail="podcast.thumbnail"
            :podcastId="podcast.id"
          />
        </el-col>
      </el-row>
    </div>
    <div v-if="!this.recentlyPlayedEpisodes && !this.recentlyPlayedPodcasts">
      You haven't listened to any podcasts yet.
      Start now by listening by searching your favorite podcasts
      <router-link to="/search">here.</router-link>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.section {
  border-bottom: 1px solid #ebebeb;
  &:last-child {
    border-bottom: unset;
  }
}
</style>

<script>
import axios from 'axios';
import globalMixin from '../sevices/_helper';
import PodcastCard from '../components/PodcastCard.vue';
import PodcastEpisode from '../components/PodcastEpisode.vue';

const Store = require('electron-store');

const ElectronStore = new Store();

export default {
  name: 'Continue',
  components: {
    PodcastEpisode,
    PodcastCard,
  },
  data() {
    return {
      isLoadingPodcasts: true,
      isLoadingEpisodes: true,
      recentlyPlayedPodcasts: null,
      recentlyPlayedEpisodes: null,
      recentlyPlayedEpisodesIds: null,
      results: {
        podcasts: {},
        episodes: {},
      },
    };
  },
  methods: {
    batchFetchPodcasts() {
      const ids = `ids=${this.recentlyPlayedPodcasts.toString()}`;
      console.log(ids);

      const options = {
        method: 'POST',
        headers: {
          'X-ListenAPI-Key': '2e2c4f39b7b44659b73cb3b31f95236e',
          'content-type': 'application/x-www-form-urlencoded',
        },
        data: ids,
        url: 'https://listen-api.listennotes.com/api/v2/podcasts',
      };
      axios(options)
        .then((response) => {
          console.log(response);

          // To sort response correspondig to recent order
          const sortedArrayOnRecent = response.data.podcasts.sort(
            (a, b) => this.recentlyPlayedPodcasts.indexOf(a.id)
              - this.recentlyPlayedPodcasts.indexOf(b.id),
          );

          this.results.podcasts = sortedArrayOnRecent.reverse();
        })
        .catch((error) => {
          console.log(error);
          globalMixin.methods.somethingWentWrongNotification(this);
        });
    },
    batchFetchEpisodes() {
      console.log(this.recentlyPlayedEpisodes);

      const episodeIds = this.recentlyPlayedEpisodes.map((episode) => episode.id);
      const ids = `ids=${episodeIds.toString()}`;
      console.log(ids);

      const options = {
        method: 'POST',
        headers: {
          'X-ListenAPI-Key': '2e2c4f39b7b44659b73cb3b31f95236e',
          'content-type': 'application/x-www-form-urlencoded',
        },
        data: ids,
        url: 'https://listen-api.listennotes.com/api/v2/episodes',
      };
      axios(options)
        .then((response) => {
          // To sort response correspondig to recent order
          const sortedArrayOnRecent = response.data.episodes.sort(
            (a, b) => this.recentlyPlayedEpisodesIds.indexOf(a.id)
              - this.recentlyPlayedEpisodesIds.indexOf(b.id),
          );

          this.results.episodes = sortedArrayOnRecent.reverse();
        })
        .catch((error) => {
          console.log(error);

          globalMixin.methods.somethingWentWrongNotification(this);
        });
    },
  },

  created() {
    console.log('Creating...');

    this.recentlyPlayedPodcasts = ElectronStore.get('recentlyPlayedPodcasts');
    this.recentlyPlayedEpisodes = ElectronStore.get('recentlyPlayedEpisodes');
    this.recentlyPlayedEpisodesIds = this.recentlyPlayedEpisodes.map(
      (episode) => episode.id,
    );
  },
  beforeMount() {
    if (this.recentlyPlayedPodcasts) {
      this.batchFetchPodcasts();
    }
    if (this.recentlyPlayedEpisodes) {
      this.batchFetchEpisodes();
    }
  },
};
</script>
