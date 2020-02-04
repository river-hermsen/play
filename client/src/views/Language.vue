<template>
  <div v-loading="isLoadingComponent">
    <div class="search-head">
      <h2>Search in {{languageName}}</h2>
      <el-input
        class="search-input"
        placeholder="Search podcasts or episodes"
        v-model="searchQuery"
        suffix-icon="el-icon-search"
      ></el-input>
    </div>
    <div class="search-content">
      <div id="searchContent">
        <div
          id="podcasts"
          class="section-search"
          v-if="searchPodcastsRes.length !== 0
      || isLoadingPodcasts"
        >
          <h1>Podcasts</h1>
          <el-row :gutter="20" v-if="isLoadingPodcasts">
            <el-col :span="6" v-for="loadingCard in amountLoadingPodcasts" :key="loadingCard">
              <LoadingPodcastCard />
            </el-col>
          </el-row>

          <el-row :gutter="20" v-if="!isLoadingPodcasts">
            <el-col :span="6" v-for="podcast in searchPodcastsRes" :key="podcast.id">
              <PodcastCard
                :title="podcast.title_original"
                :mainGenre="podcast.mainGenreName"
                :thumbnail="podcast.thumbnail"
                :podcastId="podcast.id"
              />
            </el-col>
          </el-row>
        </div>
        <div
          id="episodes"
          class="section-search"
          v-if="searchEpisodesRes.length !== 0 || isLoadingEpisodes"
        >
          <h1>Episodes</h1>
          <div v-if="isLoadingEpisodes">
            <div v-for="loadingCard in amountLoadingEpisodes" :key="loadingCard">
              <LoadingEpisodeSearch />
            </div>
          </div>
          <div v-if="!isLoadingEpisodes">
            <div v-for="episode in searchEpisodesRes" :key="episode.id">
              <PodcastEpisodeSearch
                :episodeId="episode.id"
                :podcastId="episode.podcast_id"
                :episodeTitle="episode.title_original"
                :podcastTitle="episode.podcast_title_original"
                :image="episode.image"
                :description="episode.description_original"
                :pubDateMS="episode.pub_date_ms"
              />
            </div>
          </div>
        </div>
        <div v-if="noPodcastResFound && noEpisodeResFound">
          <h3>No results found...</h3>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.search-head {
  border-bottom: 1px solid #ebebeb;
  padding-bottom: 2rem;
}
</style>

<script>
import axios from 'axios';
import globalMixin from '../sevices/_helper';
import PodcastCard from '../components/PodcastCard.vue';
import LoadingPodcastCard from '../components/loading/LoadingPodcastCard.vue';
import PodcastEpisodeSearch from '../components/PodcastEpisodeSearch.vue';
import LoadingEpisodeSearch from '../components/loading/LoadingEpisodeSearch.vue';

export default {
  name: 'Language',
  components: {
    PodcastCard,
    LoadingPodcastCard,
    PodcastEpisodeSearch,
    LoadingEpisodeSearch,
  },
  data() {
    return {
      isLoadingComponent: true,
      isLoadingPodcasts: false,
      isLoadingEpisodes: false,
      languageName: '',
      searchQuery: null,
      amountLoadingPodcasts: 6,
      amountLoadingEpisodes: 6,
      searchPodcastsRes: [],
      searchEpisodesRes: [],
      noPodcastResFound: false,
      noEpisodeResFound: false,
    };
  },
  beforeMount() {
    this.debounceSearchForQuery = globalMixin.methods.debounce(
      this.searchForQuery,
      500,
    );

    this.languageName = this.$route.params.name;
  },
  mounted() {
    this.isLoadingComponent = false;
  },
  methods: {
    searchForQuery() {
      const encodedURI = encodeURIComponent(this.searchQuery);
      if (this.searchQuery.length >= 2) {
        this.searchForPodcasts(encodedURI);
        this.searchForEpisodes(encodedURI);
      } else {
        this.searchPodcastsRes = [];
        this.searchEpisodesRes = [];
      }
    },
    searchForPodcasts(encodedURI) {
      this.isLoadingPodcasts = true;
      axios
        .get(
          `https://listen-api.listennotes.com/api/v2/search?q=${encodedURI}&type=podcast&only_in=title%2Cdescription&language=${this.languageName}`,
          {
            headers: { 'X-ListenAPI-Key': '2e2c4f39b7b44659b73cb3b31f95236e' },
          },
        )
        .then((response) => {
          this.isLoadingPodcasts = false;
          if (response.data.count === 0) {
            this.noPodcastResFound = true;
          } else {
            this.searchPodcastsRes = response.data.results;
          }
        })
        .catch(() => {});
    },
    searchForEpisodes(encodedURI) {
      this.isLoadingEpisodes = true;
      axios
        .get(
          `https://listen-api.listennotes.com/api/v2/search?q=${encodedURI}&type=episode&only_in=title%2Cdescription&language=${this.languageName}`,
          {
            headers: { 'X-ListenAPI-Key': '2e2c4f39b7b44659b73cb3b31f95236e' },
          },
        )
        .then((response) => {
          this.isLoadingEpisodes = false;
          if (response.data.count === 0) {
            this.noEpisodeResFound = true;
          } else {
            this.searchEpisodesRes = response.data.results;
          }
        })
        .catch(() => {});
    },
  },
  watch: {
    searchQuery() {
      if (this.searchQuery.length >= 2) {
        this.debounceSearchForQuery();
      } else {
        this.isLoadingPodcasts = false;
        this.isLoadingEpisodes = false;
        this.podcasts = [];
        this.episodes = [];
      }
    },
  },
};
</script>
