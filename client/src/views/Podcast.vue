<template>
  <div id="podcast" v-if="podcastInfo">
    <div id="mainPodcastInfo" class="row">
      <div class="col-md-6">
        <img :src="podcastInfo.image" alt="Podcats Cover" class="image" />
      </div>
      <div class="col-md-16 text-info">
        <h1 class="title">{{podcastInfo.title}}</h1>
        <h5 class="publisher">Publisher: {{podcastInfo.publisher}}</h5>
        <p class="description">{{_removeHTMLTags(podcastInfo.description)}}</p>
      </div>
    </div>
    <div class="row" id="podcastEpisodesExtraInfo">
      <div id="extraPodcastInfo" class="col-md-5">
        <div class="extra-info">
          <b>Language</b>
          <p>{{podcastInfo.language}}</p>
        </div>
        <div class="extra-info">
          <b>Country</b>
          <p>{{podcastInfo.country}}</p>
        </div>
        <div class="extra-info">
          <b>Genre(s)</b>
          <p v-for="genreId in podcastInfo.genre_ids" :key="genreId">{{_getGenreByID(genreId).name}}</p>
        </div>
        <div class="extra-info">
          <b>Latest epsiode:</b>
          <p>{{_formatDate(_msToDate(podcastInfo.latest_pub_date_ms))}}</p>
        </div>
      </div>
      <div id="podcastEpisodes" class="col-md-19">
        <div id="episodesContainer">
          <div id="searchContainer">
            <h4>Search for specific episodes:</h4>
            <at-input v-model="searchQuery" placeholder="Search episodes" size="large"></at-input>
          </div>
          <h1 class="episodes-header">Episodes:</h1>
          <div id="headerContainer" class="row">
            <div class="col-md-2 podcast-play"></div>
            <div class="col-md-7">Title</div>
            <div class="col-md-13">Description</div>
            <div class="col-md-2 podcast-time">
              <i class="icon icon-clock"></i>
            </div>
          </div>
          <div v-if="!noResultsFound && searchResults && searchResults.length !== 0">
            <PodcastEpisode
              v-for="episode in searchResults"
              :key="episode.id"
              :id="episode.id"
              :title="episode.title_original"
              :description="episode.description_original"
              :audioLength="episode.audio_length_sec"
            />
          </div>
          <div
            v-else-if="!noResultsFound && searchResults.length === 0 && podcastInfo.episodes.length !== 0 && !isLoadingQueryEpisode"
          >
            <PodcastEpisode
              v-for="episode in podcastInfo.episodes"
              :key="episode.id"
              :episode="episode"
              :id="episode.id"
              :title="episode.title"
              :image="episode.image"
              :description="episode.description"
              :audio="episode.audio"
              :audioLength="episode.audio_length_sec"
              :podcastTitle="podcastInfo.title"
            />
          </div>
          <div v-if="noResultsFound" class="row">
            <h3 id="noResultsFoundHeader" class="col-md-offset-2">
              No episodes found, try using the
              <router-link to="/search">search page</router-link>.
            </h3>
          </div>
          <div class="loader" v-if="loadingNewEpisodes || isLoadingQueryEpisode"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
#podcast {
  #mainPodcastInfo {
    border-bottom: 1px solid #ebebeb;
    padding-bottom: 2rem;
    .image {
      width: 100%;
    }
    .text-info {
      margin-top: 0.5rem;
      margin-left: 1rem;
      .title {
        font-size: 1.6rem;
      }
      .publisher {
        margin-bottom: 0.5rem;
      }
      .description {
        display: -webkit-box;
        -webkit-line-clamp: 5;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }
    }
  }
  #podcastEpisodesExtraInfo {
    margin-top: 1.5rem;
    #extraPodcastInfo {
      border-right: 1px solid #ebebeb;
      .extra-info {
        margin-bottom: 1.25rem;
      }
    }
    #podcastEpisodes {
      #episodesContainer {
        margin: 0 1rem 0 1rem;
        #noResultsFoundHeader {
          margin-top: 1rem;
        }
        .episodes-header {
          margin-bottom: 0.5rem;
        }
        #searchContainer {
          border-bottom: 1px solid #ebebeb;
          padding-bottom: 0.75rem;
          margin-bottom: 1rem;
          h4 {
            margin-bottom: 0.2rem;
          }
        }
        #headerContainer {
          font-size: 1.1em;
          border-bottom: 1px solid #ebebeb;
        }
      }
    }
  }
}

.loader {
  width: 40px;
  height: 40px;
  margin: 30px auto;
  background-color: #333;

  border-radius: 100%;
  -webkit-animation: sk-scaleout 1s infinite ease-in-out;
  animation: sk-scaleout 1s infinite ease-in-out;
}

@-webkit-keyframes sk-scaleout {
  0% {
    -webkit-transform: scale(0);
  }
  100% {
    -webkit-transform: scale(1);
    opacity: 0;
  }
}

@keyframes sk-scaleout {
  0% {
    -webkit-transform: scale(0);
    transform: scale(0);
  }
  100% {
    -webkit-transform: scale(1);
    transform: scale(1);
    opacity: 0;
  }
}
</style>

<script>
/* eslint-disable semi */
import axios from 'axios';
import { globalMixin } from '../sevices/_helper';
import PodcastEpisode from '../components/PodcastEpisode';
export default {
  name: 'Podcast',
  mixins: [globalMixin],
  components: { PodcastEpisode },
  data: () => {
    return {
      isLoading: false,
      isLoadingQueryEpisode: false,
      podcastId: null,
      podcastInfo: undefined,
      loadingNewEpisodes: false,
      searchResults: [],
      noResultsFound: false,
      searchQuery: null,
      nextPubDate: null
    };
  },
  methods: {
    onScroll () {
      var offset =
        document.documentElement.scrollTop + window.innerHeight + 200;
      var height = document.documentElement.offsetHeight;
      if (offset >= height) {
        this.getMoreEpisodes();
      }
    },
    getMoreEpisodes () {
      if (
        this.podcastInfo.total_episodes > this.podcastInfo.episodes.length &&
        !this.loadingNewEpisodes
      ) {
        this.loadingNewEpisodes = true;
        axios
          .get(
            `https://listen-api.listennotes.com/api/v2/podcasts/${this.podcastId}?next_episode_pub_date=${this.nextPubDate}`,
            {
              headers: { 'X-ListenAPI-Key': '2e2c4f39b7b44659b73cb3b31f95236e' }
            }
          )
          .then(response => {
            this.nextPubDate = response.data.next_episode_pub_date;
            this.podcastInfo.episodes = this.podcastInfo.episodes.concat(
              response.data.episodes
            );
            this.loadingNewEpisodes = false;
          })
          .catch(error => {
            console.log(error);
            this.$Loading.error();
          });
      }
    },
    searchEpisodes () {
      if (this.searchQuery) {
        console.log('running');
        var searchQueryURI = encodeURIComponent(this.searchQuery);
        var podcastIdURI = encodeURIComponent(this.podcastInfo.id);

        axios
          .get(
            `https://listen-api.listennotes.com/api/v2/search?q=${searchQueryURI}&ocid=${podcastIdURI}`,
            {
              headers: { 'X-ListenAPI-Key': '2e2c4f39b7b44659b73cb3b31f95236e' }
            }
          )
          .then(response => {
            this.noResultsFound = false;
            console.log('found');

            if (response.data.count > 0) {
              console.log('results found!');

              this.searchResults = response.data.results;
            } else {
              console.log('NO results found!');

              this.noResultsFound = true;
            }

            if (this.isLoadingQueryEpisode) {
              this.isLoadingQueryEpisode = false;
            }
          })
          .catch(error => {
            console.log(error);
            this.$Loading.error();
          });
      } else {
        this.noResultsFound = false;
        this.searchResults = [];
        console.log('not running');
      }
    }
  },
  watch: {
    searchQuery (newQuery) {
      if (this.isLoadingQueryEpisode) {
        this.searchEpisodes();
      } else {
        this.debounceSearchForQuery();
      }
    },
    isLoading (newVal) {
      if (!newVal && this.$route.query.episode) {
        const episodeName = decodeURIComponent(this.$route.query.episode);
        this.searchQuery = episodeName;
      }
    }
  },
  beforeCreate () {
    this.$Loading.start();
  },
  created () {
    this.isLoading = true;
    if (this.$route.query.episode) {
      this.isLoadingQueryEpisode = true;
    }
    this.debounceSearchForQuery = globalMixin.methods._debounce(
      this.searchEpisodes,
      500
    );

    if (this.$route.params.id.length !== 32) {
      this.$router.go(-1);
    } else {
      this.podcastId = this.$route.params.id;
    }
  },
  beforeMount () {
    axios
      .get(
        `https://listen-api.listennotes.com/api/v2/podcasts/${this.podcastId}`,
        {
          headers: { 'X-ListenAPI-Key': '2e2c4f39b7b44659b73cb3b31f95236e' }
        }
      )
      .then(response => {
        console.log(response.data);
        this.nextPubDate = response.data.next_episode_pub_date;
        this.podcastInfo = response.data;
        this.isLoading = false;
        this.$Loading.finish();
      })
      .catch(error => {
        console.log(error);
        this.$Loading.error();
      });
  },
  mounted () {
    window.onscroll = () => {
      this.onScroll();
    };
  }
};
</script>
