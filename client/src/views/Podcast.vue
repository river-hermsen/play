<template>
  <div id="podcast" v-if="podcastInfo">
    <div id="mainPodcastInfo" class="row">
      <div class="col-md-6">
        <img :src="podcastInfo.image" alt="Podcats Cover" class="image" />
      </div>
      <div class="col-md-16 text-info">
        <h1 class="title">{{podcastInfo.title}}</h1>
        <h5 class="publisher">Publisher: {{podcastInfo.publisher}}</h5>
        <p class="description">{{podcastInfo.description}}</p>
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
          <div id="headerContainer" class="row">
            <div class="col-md-2 podcast-play"></div>
            <div class="col-md-7">Title</div>
            <div class="col-md-13">Description</div>
            <div class="col-md-2 podcast-time">
              <i class="icon icon-clock"></i>
            </div>
          </div>
          <div class="podcast row" v-for="episode in podcastInfo.episodes" :key="episode.id">
            <div class="col-md-2 podcast-play" @click="_playEpisode(episode)">
              <i class="icon icon-play-circle"></i>
            </div>
            <div class="col-md-7">
              <b>{{episode.title}}</b>
            </div>
            <div
              class="col-md-13 description"
              :id="episode.id"
              @click="showHideDescription(episode.id)"
            >
              <p>{{_removeHTMLTags(episode.description)}}</p>
            </div>
            <div class="col-md-2 podcast-time">{{_formatTime(episode.audio_length_sec)}}</div>
          </div>
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
    margin-top: 2rem;
    #extraPodcastInfo {
      border-right: 1px solid #ebebeb;
      .extra-info {
        margin-bottom: 1.25rem;
      }
    }
    #podcastEpisodes {
      #episodesContainer {
        margin: 0 1rem 0 1rem;
      }
      .podcast-play {
        text-align: center;
        font-size: 2em;
        cursor: pointer;
      }
      .podcast-time {
        text-align: center;
      }
      #headerContainer {
        font-size: 1.1em;
        border-bottom: 1px solid #ebebeb;
      }
      .podcast {
        padding: 0.5rem 0 0.5rem 0;
        border-bottom: 1px solid #ebebeb;
        .description {
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
          overflow: hidden;
          cursor: pointer;
        }
        .description-show {
          -webkit-line-clamp: unset;
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

export default {
  name: 'Podcast',
  mixins: [globalMixin],
  data: () => {
    return {
      podcastId: null,
      podcastInfo: undefined
    };
  },
  methods: {
    showHideDescription (episodeId) {
      document.getElementById(episodeId).classList.toggle('description-show');
    }
  },
  created () {
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

        this.podcastInfo = response.data;
      })
      .catch(function (error) {
        console.log(error);
      });
  }
};
</script>
