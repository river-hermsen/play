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
      <div id="podcasts" class="section-search" v-if="true">
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
      <div id="episodes" class="section-search" v-if="true">
        <h1>Episodes</h1>
        <div>
          <!-- <div id="headerContainer" class="row">
            <div class="col-md-2"></div>
            <div class="col-md-7">Title</div>
            <div class="col-md-13">Description</div>
            <div class="col-md-2 episode">
              <i class="icon icon-clock"></i>
            </div>
          </div>-->
          <div class="episode row">
            <div class="col-md-3 image-container">
              <img
                src="https://cdn-images-1.listennotes.com/podcasts/the-joe-rogan/1398-lil-duval-_Mje1h3PF4R-z38coURks-l.300x200.jpg"
              />
            </div>
            <div class="col-md-7">
              <h4>The Joe Rogan Experience:</h4>
              <div>
                <span>#1398 - Lil Duval</span>
              </div>
            </div>
            <div class="col-md-13 description">
              <p>Lil Duval is a stand-up comedian and recording artist.</p>
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
      .episode {
        .image-container {
          img {
            width: 100%;
          }
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
          `https://listen-api.listennotes.com/api/v2/search?q=${encodedURI}&type=podcast&only_in=title%2Cdescription`,
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
    searchForEpisodes (encodedURI) {}
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
