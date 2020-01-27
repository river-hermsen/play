<template>
  <div id="search">
    <div class="header">
      <el-input
        class="search-input"
        placeholder="Search podcasts or episodes"
        v-model="searchQuery"
        suffix-icon="el-icon-search"
      ></el-input>
    </div>
    <div id="searchContent">
      <div
        id="podcasts"
        class="section-search"
        v-if="podcasts.length !== 0
      || isLoadingPodcasts"
      >
        <h1>Podcasts</h1>
        <el-row :gutter="20" v-if="isLoadingPodcasts">
          <el-col :span="6" v-for="loadingCard in amountLoadingPodcasts" :key="loadingCard">
            <LoadingPodcastCard />
          </el-col>
        </el-row>

        <el-row :gutter="20" v-if="!isLoadingPodcasts">
          <el-col :span="6" v-for="podcast in podcasts" :key="podcast.id">
            <PodcastCard
              :title="podcast.title_original"
              :mainGenre="podcast.mainGenreName"
              :thumbnail="podcast.thumbnail"
              :podcastId="podcast.id"
            />
          </el-col>
        </el-row>
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
    .el-input__inner {
      height: 100px;
      font-size: 2.2rem !important;
    }
    .el-input__suffix {
      display: flex;
    }
    .el-input__icon.el-icon-search {
      font-size: 2.2rem !important;
      display: flex;
      align-items: center;
      margin-right: 1.5rem;
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
import globalMixin from '../sevices/_helper';
import PodcastCard from '../components/PodcastCard.vue';
import LoadingPodcastCard from '../components/loading/LoadingPodcastCard.vue';
import PodcastEpisodeSearch from '../components/PodcastEpisodeSearch.vue';
import LoadingEpisodeSearch from '../components/loading/LoadingEpisodeSearch.vue';

export default {
  data() {
    return {
      isLoadingPodcasts: false,
      isLoadingEpisodes: false,
      amountLoadingPodcasts: 8,
      amountLoadingEpisodes: 12,
      searchQuery: null,
      podcasts: [],
      episodes: [],
    };
  },
  mixins: [globalMixin],
  components: {
    PodcastCard,
    LoadingPodcastCard,
    PodcastEpisodeSearch,
    LoadingEpisodeSearch,
  },
  methods: {
    searchForQuery() {
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
    searchForPodcasts(encodedURI) {
      this.isLoadingPodcasts = true;
      axios
        .get(
          `https://listen-api.listennotes.com/api/v2/search?q=${encodedURI}&type=podcast&only_in=title%2Cdescription&language=English`,
          {
            headers: { 'X-ListenAPI-Key': '2e2c4f39b7b44659b73cb3b31f95236e' },
          },
        )
        .then((response) => {
          const podcasts = response.data.results.slice(0, 8).filter((podcast) => {
            const modifiedPodcast = podcast;
            let mainGenreId;
            if (podcast.genre_ids[0] !== 67) {
              [mainGenreId] = modifiedPodcast.genre_ids;
            } else {
              [, mainGenreId] = modifiedPodcast.genre_ids;
            }
            this.isLoadingPodcasts = false;
            modifiedPodcast.mainGenreName = globalMixin.methods.getGenreByID(
              mainGenreId,
            ).name;
            return modifiedPodcast;
          });

          this.podcasts = podcasts;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    searchForEpisodes(encodedURI) {
      this.isLoadingEpisodes = true;
      axios
        .get(
          `https://listen-api.listennotes.com/api/v2/search?q=${encodedURI}&type=episode&only_in=title%2Cdescription&language=English`,
          {
            headers: { 'X-ListenAPI-Key': '2e2c4f39b7b44659b73cb3b31f95236e' },
          },
        )
        .then((response) => {
          this.episodes = response.data.results.slice(0, 8);
          this.isLoadingEpisodes = false;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    showHideDescription(epsiodeId) {
      document.getElementById(epsiodeId).classList.toggle('description-show');
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
  created() {
    this.debounceSearchForQuery = globalMixin.methods.debounce(
      this.searchForQuery,
      500,
    );
  },
};
</script>
