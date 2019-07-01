<template>
  <div id="podcastView">
    <el-card class="cardPodcastView" v-loading="isLoading">
      <div class="infoPodcastView">
        <div class="imagePodcastView">
          <img :src="podcastInfo.thumbnail" alt />
        </div>
        <div class="innerInfoPodcastView">
          <h1 class="titlePodcastView displayInline">{{podcastInfo.title}}</h1>
          <h4 class>Last publish: {{formatDate(new Date(podcastInfo.latest_pub_date_ms))}}</h4>
          <p class="descriptionPodcastView" v-html="podcastInfo.description"></p>
        </div>
      </div>
      <div class="episodesPodcastView">
        <div
          class="el-table el-table--fit el-table--enable-row-hover el-table--enable-row-transition"
          style="width: 100%;"
        >
          <div class="el-table__header-wrapper">
            <table
              cellspacing="0"
              cellpadding="0"
              border="0"
              class="el-table__header"
              style="width: 1040px;"
            >
              <colgroup>
                <col name="el-table_1_column_1" width="60" />
                <col name="el-table_1_column_2" width="130" />
                <col name="el-table_1_column_3" width="300" />
                <col name="el-table_1_column_4" width="600" />
                <col name="gutter" width="0" />
              </colgroup>
              <thead class="has-gutter">
                <tr class>
                  <th colspan="1" rowspan="1" class="el-table_1_column_1 is-leaf">
                    <div class="cell"></div>
                  </th>
                  <th colspan="1" rowspan="1" class="el-table_1_column_2 is-leaf">
                    <div class="cell">Date</div>
                  </th>
                  <th colspan="1" rowspan="1" class="el-table_1_column_3 is-leaf">
                    <div class="cell">Title</div>
                  </th>
                  <th colspan="1" rowspan="1" class="el-table_1_column_4 is-leaf">
                    <div class="cell">Description</div>
                  </th>
                  <th class="gutter" style="width: 0px; display: none;"></th>
                </tr>
              </thead>
            </table>
          </div>
          <div class="el-table__body-wrapper is-scrolling-none">
            <table
              cellspacing="0"
              cellpadding="0"
              border="0"
              class="el-table__body"
              style="width: 1040px;"
            >
              <colgroup>
                <col name="el-table_1_column_1" width="60" />
                <col name="el-table_1_column_2" width="130" />
                <col name="el-table_1_column_3" width="300" />
                <col name="el-table_1_column_4" width="600" />
              </colgroup>
              <tbody>
                <tr
                  class="el-table__row episodes"
                  v-for="episode in podcastInfo.episodes"
                  :key="episode.id"
                  :id="'episode' + episode.id"
                >
                  <td
                    rowspan="1"
                    colspan="1"
                    class="el-table_1_column_1"
                    @click="playPodcast(episode.id)"
                  >
                    <div class="cell">
                      <i class="el-icon-video-play playEpisodeBtn"></i>
                    </div>
                  </td>
                  <td rowspan="1" colspan="1" class="el-table_1_column_2">
                    <div class="cell">{{formatDate(new Date(episode.pub_date_ms))}}</div>
                  </td>
                  <td rowspan="1" colspan="1" class="el-table_1_column_3">
                    <div class="cell titleEpisode">
                      <b>{{episode.title}}</b>
                    </div>
                  </td>
                  <td rowspan="1" colspan="1" class="el-table_1_column_4">
                    <div class="cell">
                      <div
                        class="episodeDescription notShowAllDescription"
                        :id="'descriptionEpisode' + episode.id"
                        @click="showMoreText(episode.id)"
                        v-html="rmHtmlTags(episode.description)"
                      ></div>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <el-button
          class="viewMoreEpisodesBtn"
          v-if="showViewMore"
          @click="viewMoreEpisodes"
        >View More</el-button>
      </div>
    </el-card>
  </div>
</template>

<style lang="scss">
#podcastView {
  max-width: 1080px;
  margin: 0 auto;
  min-height: 88vh;
}

.cardPodcastView {
  width: 100%;
  padding-left: 20px;
  padding-right: 50px;
  padding-top: 10px;
}

.imagePodcastView {
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);
  float: left;
  display: inline;
}

.displayInline {
  display: inline;
}
.infoPodcastView {
  height: 350px;
}
.innerInfoPodcastView {
  max-width: 618px;
  margin: 10px 0px 0px 40px;
  display: inline-block;
}

.titlePodcastView {
  font-size: 2.5rem;
}

.episodes {
  cursor: pointer;
}
.playEpisodeBtn {
  font-size: 24px;
}

.el-table {
  font-size: 16px;
}

.titleEpisode {
  word-break: keep-all !important;
}

.episodeDescription {
  word-break: keep-all;
}

.notShowAllDescription {
  max-height: 4.2rem;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
}
.showAllDescription {
  max-height: 20rem;
  overflow-y: auto;
}

.viewMoreEpisodesBtn {
  margin: 20px auto;
  display: block;
}
</style>



<script>
import axios from "axios";
import store from "../store/index.js";

export default {
  data() {
    return {
      isLoading: true,
      podcastInfo: {}
    };
  },
  mounted() {
    // Fetch meta data of podcast
    axios
      .get(
        `https://listen-api.listennotes.com/api/v2/podcasts/${this.$route.params.id}`,
        {
          headers: { "X-ListenAPI-Key": "2e2c4f39b7b44659b73cb3b31f95236e" }
        }
      )
      .then(res => {
        console.log(res.data);
        this.podcastInfo = res.data;
        this.isLoading = false;
      })
      .catch(err => {
        console.log(err);
      });

    // Check if View More btn needs to be showed
    console.log();
  },
  methods: {
    rmHtmlTags(text) {
      text = text.replace(/<\/p>/g, "\n");
      text = text.replace(/<(?:.|\s)*?>/g, "");
      text = text.replace(/(?:\r\n|\r|\n)/g, "<br />");
      return text;
    },
    showMoreText(id) {
      var description = document.getElementById("descriptionEpisode" + id);
      description.classList.toggle("notShowAllDescription");
      description.classList.toggle("showAllDescription");
    },
    formatDate(date) {
      var monthNames = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec"
      ];
      var day = date.getDate();
      var monthIndex = date.getMonth();
      var year = date.getFullYear();

      return day + " " + monthNames[monthIndex] + " " + year;
    },
    playPodcast(id) {
      // Get meta data from episode
      var currentEpisode;
      this.podcastInfo.episodes.find(episode => {
        if (episode.id == id) {
          currentEpisode = episode;
        }
      });
      this.$store.state.audioPlayer.audioSrc = currentEpisode.audio;
      this.$store.state.audioPlayer.title = currentEpisode.title;
      this.$store.state.audioPlayer.totalTime = currentEpisode.audio_length_sec;
      this.$store.state.audioPlayer.podcast = this.podcastInfo.title;
      this.$store.state.audioPlayer.thumbnailSrc = currentEpisode.image;
    },
    viewMoreEpisodes() {
      console.log(
        this.podcastInfo.episodes[this.podcastInfo.episodes.length - 1]
      );
      var lastPubDate = this.podcastInfo.episodes[
        this.podcastInfo.episodes.length - 1
      ].pub_date_ms;

      console.log(lastPubDate);

      var podcastId = this.podcastInfo.id;
      axios
        .get(
          `https://listen-api.listennotes.com/api/v2/podcasts/${podcastId}?next_episode_pub_date=${lastPubDate}`,
          {
            headers: { "X-ListenAPI-Key": "2e2c4f39b7b44659b73cb3b31f95236e" }
          }
        )
        .then(res => {
          console.log(res);
          // var newArray = this.podcastInfo.episodes.concat(res.data.episodes);
          // var newArray = res.data.episodes.concat(this.podcastInfo.episodes);
          this.podcastInfo.episodes.push(...res.data.episodes);
          // console.log(newArray);
        })
        .catch(err => {
          console.log(err);
        });
    }
  },
  computed: {
    showViewMore() {
      if (!this.isLoading) {
        if (
          this.podcastInfo.episodes.length == this.podcastInfo.total_episodes
        ) {
          console.log("dont show button");
          return false;
        } else {
          return true;
        }
      } else {
        return false;
      }
    }
  }
};
</script>
