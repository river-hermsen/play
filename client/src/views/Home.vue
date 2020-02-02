<template>
  <div id="home">
    <div class="podcast-section" id="continue-listening" v-if="recentlyPlayedPodcastIds">
      <el-button type="primary" @click="test()">Get</el-button>
      <el-button type="primary" @click="test2()">Delete</el-button>
      <el-button type="primary" @click="test3()">Get episodes</el-button>
      <el-button type="primary" @click="test4()">Delete episodes</el-button>
      <h1 class="header">Recently played</h1>
      <div class="row" v-if="isLoading">
        <el-row :gutter="16">
          <el-col :span="6" v-for="loadingCard in amountLoadingCards" :key="loadingCard">
            <LoadingPodcastCard />
          </el-col>
        </el-row>
      </div>

      <el-row :gutter="16">
        <el-col :span="6" v-for="podcast in podcasts.recentlyPlayedPodcasts" :key="podcast.id">
          <PodcastCard
            :title="podcast.title"
            :mainGenre="podcast.genreName"
            :thumbnail="podcast.thumbnail"
            :podcastId="podcast.id"
          />
        </el-col>
      </el-row>
    </div>

    <div class="podcast-section" id="most-popular">
      <h1 class="header">Popular Podcasts</h1>
      <div class="row" v-if="isLoading">
        <el-row :gutter="16">
          <el-col :span="6" v-for="loadingCard in amountLoadingCards" :key="loadingCard">
            <LoadingPodcastCard />
          </el-col>
        </el-row>
      </div>

      <el-row :gutter="16">
        <el-col :span="6" v-for="podcast in podcasts.popularGeneral" :key="podcast.id">
          <PodcastCard
            :title="podcast.title"
            :mainGenre="podcast.genreName"
            :thumbnail="podcast.thumbnail"
            :podcastId="podcast.id"
          />
        </el-col>
      </el-row>
    </div>
    <div class="podcast-section" id="random-genre">
      <h1 class="header">Popular podcasts in {{ip.countryName}}</h1>
      <div class="row" v-if="isLoading">
        <el-row :gutter="16">
          <el-col :span="6" v-for="loadingCard in amountLoadingCards" :key="loadingCard">
            <LoadingPodcastCard />
          </el-col>
        </el-row>
      </div>

      <el-row :gutter="16">
        <el-col :span="6" v-for="podcast in podcasts.popularInCountry" :key="podcast.id">
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
    font-size: 2rem;
    margin-bottom: 1rem;
  }
  .podcast-section {
    border-bottom: 1px solid #ebebeb;
    padding-bottom: 2rem;
    margin-top: 1.5rem;
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
/* eslint-disable max-len */
/* eslint-disable no-multi-spaces */

import axios from 'axios';
import globalMixin from '../sevices/_helper';
import PodcastCard from '../components/PodcastCard.vue';
import LoadingPodcastCard from '../components/loading/LoadingPodcastCard.vue';

const Store = require('electron-store');

const ElectronStore = new Store();

export default {
  name: 'Home',
  data() {
    return {
      isLoading: true,
      amountLoadingCards: 8,
      podcasts: {
        popularGeneral: [],
        popularInCountry: [],
        recentlyPlayedPodcasts: [],
      },
      recentlyPlayedPodcastIds: [],
      ip: {
        countryName: '',
        countryCode: '',
      },
    };
  },
  components: { PodcastCard, LoadingPodcastCard },
  // beforeCreate() {
  //   store.set('foo.bar', true);
  //   console.log(store.get('foo'));
  // },
  mounted() {
    this.getPopularPodcasts();
    this.getPopularPodcastsIpLocation();
    this.getRecentlyPlayedPodcasts();
  },
  methods: {
    getPopularPodcasts() {
      axios
        .get('https://listen-api.listennotes.com/api/v2/best_podcasts', {
          headers: { 'X-ListenAPI-Key': '2e2c4f39b7b44659b73cb3b31f95236e' },
        })
        .then((response) => {
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

            this.isLoading = false;
            modifiedPodcast.genreName = globalMixin.methods.getGenreByID(
              mainGenreId,
            ).name;
            return modifiedPodcast;
          });

          this.podcasts.popularGeneral = mostPopularArrayUpdated;
        })
        .catch(() => {
          globalMixin.methods.somethingWentWrongNotification(this);
        });
    },
    getPopularPodcastsIpLocation() {
      axios
        .get('https://json.geoiplookup.io/')
        .then((response) => {
          this.ip.countryName = response.data.country_name;
          this.ip.countryCode = response.data.country_code.toLowerCase();
          this.getPopularPodcastsRegion();
        })
        .catch(() => {
          globalMixin.methods.somethingWentWrongNotification(this);
        });
    },
    getPopularPodcastsRegion() {
      axios
        .get(
          `https://listen-api.listennotes.com/api/v2/best_podcasts?region=${this.ip.countryCode}`,
          {
            headers: { 'X-ListenAPI-Key': '2e2c4f39b7b44659b73cb3b31f95236e' },
          },
        )
        .then((response) => {
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

            this.isLoading = false;
            modifiedPodcast.genreName = globalMixin.methods.getGenreByID(
              mainGenreId,
            ).name;
            return modifiedPodcast;
          });

          this.podcasts.popularInCountry = mostPopularArrayUpdated;
        })
        .catch(() => {
          globalMixin.methods.somethingWentWrongNotification(this);
        });
    },
    getRecentlyPlayedPodcasts() {
      this.recentlyPlayedPodcastIds = ElectronStore.get(
        'recentlyPlayedPodcasts',
      );
      if (this.recentlyPlayedPodcastIds) {
        this.recentlyPlayedPodcastIds.reverse();
        this.recentlyPlayedPodcastIds = this.recentlyPlayedPodcastIds;
        const ids = `ids=${this.recentlyPlayedPodcastIds.toString()}`;

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
              (a, b) => this.recentlyPlayedPodcastIds.indexOf(a.id)
                - this.recentlyPlayedPodcastIds.indexOf(b.id),
            );

            this.podcasts.recentlyPlayedPodcasts = sortedArrayOnRecent;
          })
          .catch(() => {
            globalMixin.methods.somethingWentWrongNotification(this);
          });
      }
    },
    test() {
      console.log(ElectronStore.get('recentlyPlayedPodcasts'));
    },
    test2() {
      ElectronStore.delete('recentlyPlayedPodcasts');
    },
    test3() {
      console.log(ElectronStore.get('recentlyPlayedEpisodes'));
    },
    test4() {
      ElectronStore.delete('recentlyPlayedEpisodes');
    },
  },
};
</script>
