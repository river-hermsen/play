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
      <div id="podcasts" class="section-search" v-if="podcasts.length !== 0">
        <h1>Podcasts</h1>
        <div class="row">
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
      <div id="episodes" class="section-search" v-if="episodes.length !== 0">
        <h1>Episodes</h1>
        <div>
          <div class="episode row" v-for="episode in episodes" :key="episode.id">
            <div class="col-md-3 image-container">
              <router-link :to="'/podcast/' + episode.podcast_id + '?episode=' + episode.id">
                <img :src="episode.image" />
              </router-link>
            </div>
            <div class="col-md-7">
              <h4>{{episode.podcast_title_original}}:</h4>
              <div>
                <span>{{episode.title_original}}</span>
              </div>
            </div>
            <div
              class="col-md-11 description"
              :id="episode.id"
              @click="showHideDescription(episode.id)"
            >
              <p>{{episode.description_original}}</p>
            </div>
            <div class="col-md-3">
              <p>{{_formatDate(_msToDate(episode.pub_date_ms))}}</p>
            </div>
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
      .episode {
        border-bottom: 1px solid #ebebeb;
        padding: 0.5rem 0 0.5rem 0;
        .image-container {
          cursor: pointer;
          img {
            width: 100%;
          }
        }
        .description {
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 5;
          overflow: hidden;
          cursor: pointer;
        }
        .description-show {
          -webkit-line-clamp: unset;
          height: 140px;
          overflow-y: scroll;
        }
      }
    }
  }
}
</style>

<script>
/* eslint-disable semi */
import axios from 'axios';
import { globalMixin } from '../sevices/_helper';
import PodcastCard from '../components/PodcastCard';

export default {
  data () {
    return {
      searchQuery: null,
      podcasts: [],
      episodes: []
    };
  },
  mixins: [globalMixin],
  components: { PodcastCard },
  created () {
    this.debounceSearchForQuery = globalMixin.methods._debounce(
      this.searchForQuery,
      900
    );
  },
  methods: {
    searchForQuery () {
      const encodedURI = encodeURI(this.searchQuery);
      this.searchForPodcasts(encodedURI);
      this.searchForEpisodes(encodedURI);
    },
    searchForPodcasts (encodedURI) {
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
    },
    showHideDescription (epsiodeId) {
      document.getElementById(epsiodeId).classList.toggle('description-show');
    }
  },
  watch: {
    searchQuery (newQuery) {
      if (newQuery !== '' || null) {
        this.debounceSearchForQuery();
      }
    }
  }
};
</script>
