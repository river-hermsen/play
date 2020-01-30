<template>
  <div>
    <div>
      <h1>Continue where you left off!</h1>
    </div>
    <div>
      <h2>Episodes</h2>
      <div></div>
    </div>
    <div>
      <h2>Podcasts</h2>
      <div></div>
    </div>
  </div>
</template>

<style>
</style>

<script>
import axios from 'axios';
import globalMixin from '../sevices/_helper';

const Store = require('electron-store');

const ElectronStore = new Store();

export default {
  data() {
    return {
      isLoadingPodcasts: true,
      isLoadingEpisodes: true,
      ids: {
        podcast: {},
        episode: {},
      },
      results: {
        podcasts: {},
        episodes: {},
      },
    };
  },
  methods: {
    batchFetchPodcasts() {
      const ids = `ids=${this.ids.podcast.toString()}`;
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
          // To sort response correspondig to recent order
          const sortedArrayOnRecent = response.data.podcasts.sort(
            (a, b) => this.ids.podcast.indexOf(a.id) - this.ids.podcast.indexOf(b.id),
          );

          this.results.podcasts = sortedArrayOnRecent;
        })
        .catch((error) => {
          console.log(error);

          globalMixin.methods.somethingWentWrongNotification(this);
        });
    },
    batchFetchEpisodes() {
      const ids = `ids=${this.ids.episode.toString()}`;
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
          console.log(response);

          const sortedArrayOnRecent = response.data.episodes.sort(
            (a, b) => this.ids.episode.indexOf(a.id) - this.ids.episode.indexOf(b.id),
          );

          this.results.episodes = sortedArrayOnRecent;
        })
        .catch((error) => {
          console.log(error);

          globalMixin.methods.somethingWentWrongNotification(this);
        });
    },
  },

  created() {
    console.log('Creating...');

    this.ids.podcast = ElectronStore.get('recentlyPlayedPodcasts');
    this.ids.episode = ElectronStore.get('recentlyPlayedEpisodes');
  },
  beforeMount() {
    this.batchFetchPodcasts();
    this.batchFetchEpisodes();
  },
};
</script>
