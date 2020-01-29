<template>
  <div id="podcast" v-if="podcastInfo">
    <el-row id="mainPodcastInfo">
      <el-col :span="6">
        <img :src="podcastInfo.image" alt="Podcats Cover" class="image" />
      </el-col>
      <el-col :span="16" class="text-info">
        <h1 class="title">{{podcastInfo.title}}</h1>
        <span class="publisher">
          <b>Publisher: {{podcastInfo.publisher}}</b>
        </span>
        <p class="description">{{removeHTMLTags(podcastInfo.description)}}</p>
      </el-col>
    </el-row>
    <el-row id="podcastEpisodesExtraInfo">
      <el-col :span="5" id="extraPodcastInfo">
        <div class="extra-info">
          <b>Language:</b>
          <span>{{podcastInfo.language}}</span>
        </div>
        <div class="extra-info">
          <b>Country:</b>
          <span>{{podcastInfo.country}}</span>
        </div>
        <div class="extra-info">
          <b>Genre(s):</b>
          <span
            v-for="genreId in podcastInfo.genre_ids"
            :key="genreId"
          >{{getGenreByID(genreId).name}}</span>
        </div>
        <div class="extra-info">
          <b>Total epsiodes:</b>
          <span>{{podcastInfo.total_episodes}} episodes</span>
        </div>
        <div class="extra-info">
          <b>Latest epsiode:</b>
          <span>{{formatDate(msToDate(podcastInfo.latest_pub_date_ms), true)}}</span>
        </div>
      </el-col>
      <el-col :span="19" id="podcastEpisodes">
        <div id="episodesContainer">
          <div id="searchContainer">
            <h4>Search for specific episodes:</h4>
            <el-input placeholder="Search episodes" v-model="searchQuery"></el-input>
          </div>
          <h1 class="episodes-header">Episodes:</h1>
          <el-row id="headerContainer">
            <el-col :span="7" :offset="2">Title</el-col>
            <el-col :span="13">Description</el-col>
            <el-col :span="2" class="time-container">
              <i class="el-icon-time"></i>
            </el-col>
          </el-row>
          <div v-if="!noResultsFound && searchResults && searchResults.length !== 0">
            <PodcastEpisode
              v-for="episode in searchResults"
              :key="episode.id"
              :id="episode.id"
              :title="episode.title_original"
              :description="episode.description_original"
              :audioLength="episode.audio_length_sec"
              :image="episode.image"
              :audio="episode.audio"
              :podcastTitle="podcastInfo.title"
            />
          </div>
          <div
            v-else-if="!noResultsFound && searchResults.length === 0
            && podcastInfo.episodes.length !== 0 && !isLoadingQueryEpisode"
          >
            <PodcastEpisode
              v-for="episode in podcastInfo.episodes"
              :key="episode.id"
              :id="episode.id"
              :title="episode.title"
              :image="episode.image"
              :description="episode.description"
              :audio="episode.audio"
              :audioLength="episode.audio_length_sec"
              :podcastTitle="podcastInfo.title"
              :podcastId="podcastInfo.id"
            />
          </div>
          <el-row v-if="noResultsFound">
            <el-col :offset="2">
              <h3 id="noResultsFoundHeader">
                No episodes found, try using the
                <router-link to="/search">search page</router-link>.
              </h3>
            </el-col>
          </el-row>
          <div class="loader" v-if="loadingNewEpisodes || isLoadingQueryEpisode"></div>
        </div>
      </el-col>
    </el-row>
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
      margin-left: 1rem;
      .title {
        margin: unset;
      }
      .publisher {
        margin-bottom: 0.5rem;
      }
      .description {
        display: -webkit-box;
        -webkit-line-clamp: 9;
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
        span {
          display: block;
        }
      }
    }
    #podcastEpisodes {
      #episodesContainer {
        margin: 0 1rem 0 1rem;
        #noResultsFoundHeader {
          margin-top: 1rem;
        }
        .episodes-header {
          margin-bottom: 1.2rem;
          margin-left: 1rem;
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
          .time-container {
            text-align: center;
          }
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
</style>

<script>
import axios from 'axios';
import globalMixin from '../sevices/_helper';
import PodcastEpisode from '../components/PodcastEpisode.vue';

export default {
  name: 'Podcast',
  mixins: [globalMixin],
  components: { PodcastEpisode },
  data: () => ({
    isLoading: false,
    isLoadingQueryEpisode: false,
    podcastId: null,
    podcastInfo: undefined,
    loadingNewEpisodes: false,
    searchResults: [],
    noResultsFound: false,
    searchQuery: null,
    nextPubDate: null,
  }),
  methods: {
    onScroll() {
      // eslint-disable-next-line operator-linebreak
      const offset =
        document.documentElement.scrollTop + window.innerHeight + 200;

      const height = document.documentElement.offsetHeight;
      if (offset >= height) {
        this.getMoreEpisodes();
      }
    },
    getMoreEpisodes() {
      if (
        this.podcastInfo.total_episodes > this.podcastInfo.episodes.length
        && !this.loadingNewEpisodes
      ) {
        this.loadingNewEpisodes = true;
        axios
          .get(
            `https://listen-api.listennotes.com/api/v2/podcasts/${this.podcastId}?next_episode_pub_date=${this.nextPubDate}`,
            {
              headers: { 'X-ListenAPI-Key': '2e2c4f39b7b44659b73cb3b31f95236e' },
            },
          )
          .then((response) => {
            this.nextPubDate = response.data.next_episode_pub_date;
            this.podcastInfo.episodes = this.podcastInfo.episodes.concat(
              response.data.episodes,
            );
            this.loadingNewEpisodes = false;
          })
          .catch((error) => {
            console.log(error);
            this.$Loading.error();
          });
      }
    },
    searchEpisodes() {
      if (this.searchQuery) {
        console.log('running');
        const searchQueryURI = encodeURIComponent(this.searchQuery);
        const podcastIdURI = encodeURIComponent(this.podcastInfo.id);

        axios
          .get(
            `https://listen-api.listennotes.com/api/v2/search?q=${searchQueryURI}&ocid=${podcastIdURI}`,
            {
              headers: { 'X-ListenAPI-Key': '2e2c4f39b7b44659b73cb3b31f95236e' },
            },
          )
          .then((response) => {
            this.noResultsFound = false;

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
          .catch((error) => {
            console.log(error);
          });
      } else {
        this.noResultsFound = false;
        this.searchResults = [];
        console.log('not running');
      }
    },
  },
  watch: {
    searchQuery(newQuery) {
      console.log(newQuery);

      if (this.isLoadingQueryEpisode) {
        this.searchEpisodes();
      } else {
        this.debounceSearchForQuery();
      }
    },
    isLoading(newVal) {
      if (!newVal && this.$route.query.episode) {
        const episodeName = decodeURIComponent(this.$route.query.episode);
        this.searchQuery = episodeName;
      }
    },
  },
  created() {
    this.isLoading = true;
    if (this.$route.query.episode) {
      this.isLoadingQueryEpisode = true;
    }
    this.debounceSearchForQuery = globalMixin.methods.debounce(
      this.searchEpisodes,
      500,
    );

    if (this.$route.params.id.length !== 32) {
      this.$router.go(-1);
    } else {
      this.podcastId = this.$route.params.id;
    }
  },
  beforeMount() {
    axios
      .get(
        `https://listen-api.listennotes.com/api/v2/podcasts/${this.podcastId}`,
        {
          headers: { 'X-ListenAPI-Key': '2e2c4f39b7b44659b73cb3b31f95236e' },
        },
      )
      .then((response) => {
        this.nextPubDate = response.data.next_episode_pub_date;
        this.podcastInfo = response.data;
        this.isLoading = false;
      })
      .catch((error) => {
        console.log(error);
      });
  },
  mounted() {
    window.onscroll = () => {
      this.onScroll();
    };
  },
};
</script>
