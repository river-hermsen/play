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
      <div id="podcasts" class="section-search" v-if="podcasts.length !== 0 || isLoadingPodcasts">
        <h1>Podcasts</h1>
        <div class="row" v-if="isLoadingPodcasts">
          <div class="col-md-6" v-for="loadingCard in amountLoadingPodcasts" :key="loadingCard">
            <LoadingPodcastCard />
          </div>
        </div>

        <div class="row" v-if="!isLoadingPodcasts">
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
      <div id="episodes" class="section-search" v-if="episodes.length !== 0 || isLoadingEpisodes">
        <h1>Episodes</h1>
        <div v-if="isLoadingEpisodes">
          <div v-for="loadingCard in amountLoadingEpisodes" :key="loadingCard">
            <LoadingEpisodeSearch />
          </div>
        </div>

        <div v-if="!isLoadingEpisodes">
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
      isLoadingPodcasts: false,
      isLoadingEpisodes: false,
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
      if (this.searchQuery.length >= 2) {
        this.searchForPodcasts(encodedURI);
        this.searchForEpisodes(encodedURI);
      } else {
        console.log('empty');
        this.podcasts = [];
        this.episodes = [];
      }
    },
    searchForPodcasts (encodedURI) {
      this.isLoadingPodcasts = true;
      this.$Loading.start();
      axios
        .get(
          `https://listen-api.listennotes.com/api/v2/search?q=${encodedURI}&type=podcast&only_in=title%2Cdescription&language=English`,
          {
            headers: { 'X-ListenAPI-Key': '2e2c4f39b7b44659b73cb3b31f95236e' }
          }
        )
        .then(response => {
          var podcasts = response.data.results.slice(0, 8).filter(podcast => {
            var mainGenreId;
            if (podcast.genre_ids[0] === 67) {
              mainGenreId = podcast.genre_ids[1];
            } else {
              mainGenreId = podcast.genre_ids[0];
            }
            this.isLoadingPodcasts = false;
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
    },
    searchForEpisodes (encodedURI) {
      this.isLoadingEpisodes = true;
      axios
        .get(
          `https://listen-api.listennotes.com/api/v2/search?q=${encodedURI}&type=episode&only_in=title%2Cdescription&language=English`,
          {
            headers: { 'X-ListenAPI-Key': '2e2c4f39b7b44659b73cb3b31f95236e' }
          }
        )
        .then(response => {
          this.episodes = response.data.results.slice(0, 8);
          this.isLoadingEpisodes = false;
        })
        .catch(error => {
          console.log(error);
        });
    },
    showHideDescription (epsiodeId) {
      document.getElementById(epsiodeId).classList.toggle('description-show');
    }
  },
  watch: {
    searchQuery (newQuery) {
      if (this.searchQuery.length >= 2) {
        this.debounceSearchForQuery();
      } else {
        this.isLoadingPodcasts = false;
        this.isLoadingEpisodes = false;
        this.podcasts = [];
        this.episodes = [];
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
