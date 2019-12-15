<template>
  <div id="search">
    <div class="header">
      <!-- <h1>Search</h1> -->
      <at-input
        v-model="searchQuery"
        class="search-input"
        placeholder="Search podcasts or episodes"
        icon="search"
      ></at-input>
    </div>
    <div id="searchContent">
      <div id="podcasts" class="section-search" v-if="podcasts.length !== 0 || isLoading">
        <h1>Podcasts</h1>
        <div class="row" v-if="isLoading">
          <div class="col-md-6" v-for="loadingCard in amountLoadingPodcasts" :key="loadingCard">
            <LoadingPodcastCard />
          </div>
        </div>

        <div class="row" v-if="!isLoading">
          <div class="col-md-6" v-for="podcast in podcasts" :key="podcast.id">
            <PodcastCard
              :title="podcast.title_original"
              :mainGenre="podcast.mainGenreName"
              :thumbnail="podcast.thumbnail"
              :podcastId="podcast.id"
            />
          </div>
        </div>
      </div>
      <div id="episodes" class="section-search" v-if="episodes.length !== 0 || isLoading">
        <h1>Episodes</h1>
        <div v-if="isLoading">
          <div v-for="loadingCard in amountLoadingEpisodes" :key="loadingCard">
            <LoadingEpisodeSearch />
          </div>
        </div>

        <div v-if="!isLoading">
          <div v-for="episode in episodes" :key="episode.id">
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
    </div>
  </div>
</template>

<style lang="scss">
#search {
  .header {
    h1 {
      font-size: 2rem;
    }
    .search-input {
      line-height: 2;
      input {
        font-size: 2rem;
      }
    }
  }
  #searchContent {
    .section-search {
      h1 {
        font-size: 1.8rem;
        margin-bottom: 1rem;
        margin-left: 0.2rem;
      }
    }
    #podcasts {
      margin: 2rem 0 4rem 0;
    }
    #episodes {
      margin-top: 2rem;
    }
  }
}
</style>

<script>
import axios from 'axios';
import { globalMixin } from '../sevices/_helper';
import PodcastCard from '../components/PodcastCard';
import LoadingPodcastCard from '../components/loading/LoadingPodcastCard';
import PodcastEpisodeSearch from '../components/PodcastEpisodeSearch';
import LoadingEpisodeSearch from '../components/loading/LoadingEpisodeSearch';

export default {
  data () {
    return {
      isLoading: false,
      amountLoadingPodcasts: 8,
      amountLoadingEpisodes: 12,
      searchQuery: null,
      podcasts: [],
      episodes: []
    };
  },
  mixins: [globalMixin],
  components: {
    PodcastCard,
    LoadingPodcastCard,
    PodcastEpisodeSearch,
    LoadingEpisodeSearch
  },
  methods: {
    searchForQuery () {
      const encodedURI = encodeURIComponent(this.searchQuery);
      this.searchForPodcasts(encodedURI);
      this.searchForEpisodes(encodedURI);
    },
    searchForPodcasts (encodedURI) {
      if (this.searchQuery !== '' || null) {
        this.isLoading = true;
        this.$Loading.start();
        axios
          .get(
            `https://listen-api.listennotes.com/api/v2/search?q=${encodedURI}&type=podcast&only_in=title%2Cdescription&language=English`,
            {
              headers: { 'X-ListenAPI-Key': '2e2c4f39b7b44659b73cb3b31f95236e' }
            }
          )
          .then(response => {
            console.log(response.data);

            var podcasts = response.data.results.slice(0, 8).filter(podcast => {
              var mainGenreId;
              if (podcast.genre_ids[0] === 67) {
                mainGenreId = podcast.genre_ids[1];
              } else {
                mainGenreId = podcast.genre_ids[0];
              }
              this.isLoading = false;
              this.$Loading.finish();
              return (podcast.mainGenreName = globalMixin.methods._getGenreByID(
                mainGenreId
              ).name);
            });

            this.podcasts = podcasts;
          })
          .catch(function (error) {
            console.log(error);
          });
      } else {
        this.podcasts = [];
      }
    },
    searchForEpisodes (encodedURI) {
      if (this.searchQuery !== '' || null) {
        axios
          .get(
            `https://listen-api.listennotes.com/api/v2/search?q=${encodedURI}&type=episode&only_in=title%2Cdescription&language=English`,
            {
              headers: { 'X-ListenAPI-Key': '2e2c4f39b7b44659b73cb3b31f95236e' }
            }
          )
          .then(response => {
            console.log(response.data.results);

            this.episodes = response.data.results.slice(0, 8);
          })
          .catch(function (error) {
            console.log(error);
          });
      } else {
        this.episodes = [];
      }
    },
    showHideDescription (epsiodeId) {
      document.getElementById(epsiodeId).classList.toggle('description-show');
    }
  },
  watch: {
    searchQuery (newQuery) {
      if (newQuery !== '' || null) {
        console.log(newQuery);

        this.debounceSearchForQuery();
      } else {
        this.isLoading = false;
        this.$Loading.finish();
      }
    }
  },
  created () {
    this.debounceSearchForQuery = globalMixin.methods._debounce(
      this.searchForQuery,
      500
    );
  }
};
</script>
