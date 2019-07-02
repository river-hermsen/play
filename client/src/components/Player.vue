<template>
  <div id="player">
    <audio
      id="audioPlayer"
      :src="audioSrc"
      type="audio/mp3"
      @timeupdate="currentTimeInSeconds = $event.target.currentTime"
      ref="audioElement"
    ></audio>
    <el-row>
      <el-col :span="7">
        <div>
          <img :src="thumbnailSrc" class="imgPlayerInfo noInfoImgPlayerInfo" ref="imgEpisode" />
          <h2 class="titlePlayerInfo noInfoTitlePlayerInfo" ref="titleEpisode">{{title}}</h2>
          <br />
          <h3
            class="podcastTitlePlayerInfo noInfoPodcastTitlePlayerInfo"
            ref="podcastEpisode"
          >{{podcast}}</h3>
        </div>
      </el-col>
      <el-col :span="11">
        <div class="audioControls">
          <div class="playPauseContainer">
            <div @click="playPauseEpisode" :class="{pause: isPlaying, play: !isPlaying}"></div>
          </div>

          <div class="seekAudio">
            <div class="containerCurrentAndTotal">
              <span
                id="currentTime"
              >{{new Date(currentTimeInSeconds * 1000).toISOString().substr(11, 8)}}</span> /
              <span
                id="totalTime"
              >{{new Date(totalTimeInSeconds * 1000).toISOString().substr(11, 8)}}</span>
            </div>
            <div class="seekerSlider">
              <el-slider
                v-model="currentTimeInSeconds"
                :max="totalTimeInSeconds"
                :show-tooltip="false"
                @change="seeking"
              ></el-slider>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>

    <!-- <el-button @click="test">test buttn</el-button> -->
  </div>
</template>

<script>
export default {
  data() {
    return {
      time: 0,
      audioElement: {},
      audioSrc: "",
      title: "",
      thumbnailSrc: "",
      podcast: "",
      isPlaying: false,
      currentTimeInSeconds: 0,
      currentTimeFormated: 0,
      totalTimeInSeconds: 0,
      totalTimeFormated: 0
    };
  },
  mounted() {
    this.audioElement = this.$refs.audioElement;
    this.audioElement.oncanplay = () => {
      this.audioElement.play();
      console.log("Can start playing audio.");
    };
  },
  methods: {
    playPauseEpisode() {
      console.log(this.audioSrc);

      if (this.isPlaying) {
        this.audioElement.pause();
        this.isPlaying = false;
      } else if (!this.isPlaying) {
        this.audioElement.play();
        this.isPlaying = true;
      } else {
        console.error("Error playing or pausing");
      }
    },
    getTotalTime() {
      // console.log(this.audioElement.duration);
      if (!isNaN(this.audioElement.duration)) {
        this.totalTimeInSeconds = this.audioElement.duration;
      }
    },
    seeking() {
      this.audioElement.currentTime = this.currentTimeInSeconds;
    }
  },
  computed: {
    formattedTotalTime() {
      var date = new Date(null);
      date.setSeconds(this.totalTimeInSeconds); // specify value for SECONDS here
      return date.toISOString().substr(11, 8);
    },
    formatTime(seconds) {
      console.log(seconds);

      var date = new Date(null);
      date.setSeconds(seconds); // specify value for SECONDS here
      return date.toISOString().substr(11, 8);
    },
    audioVuex() {
      return this.$store.state.audioPlayer.audioSrc;
    }
  },
  watch: {
    audioVuex(newAudio) {
      console.log(this.$refs.podcastEpisode);
      this.$refs.titleEpisode.classList.remove("noInfoTitlePlayerInfo");
      this.$refs.podcastEpisode.classList.remove(
        "noInfoPodcastTitlePlayerInfo"
      );
      this.$refs.imgEpisode.classList.remove("noInfoImgPlayerInfo");
      this.audioSrc = newAudio;
      this.title = this.$store.state.audioPlayer.title;
      this.totalTimeInSeconds = this.$store.state.audioPlayer.totalTime;
      this.thumbnailSrc = this.$store.state.audioPlayer.thumbnailSrc;
      this.podcast = this.$store.state.audioPlayer.podcast;
      this.audioElement.load();
      if (!this.isPlaying) {
        this.isPlaying = true;
      }
    }
  }
};
</script>


<style lang="scss">
#player {
  background-color: #ffffff;
  position: fixed;
  bottom: 0px;
  width: 100vw;
  height: 150px;
  z-index: 99;
}

.imgPlayerInfo {
  height: 150px;
  float: left;
}

.noInfoImgPlayerInfo {
  background-color: #e2e2e2;
  height: 150px;
  width: 150px;
}

.titlePlayerInfo {
  margin: 0px;
  padding-top: 20px;
  padding-left: 160px;
}

.noInfoTitlePlayerInfo {
  background-color: #e2e2e2;
  width: 300px;
  height: 35px;
}

.podcastTitlePlayerInfo {
  margin: 0px;
  padding-left: 160px;
}
.noInfoPodcastTitlePlayerInfo {
  background-color: #e2e2e2;
  width: 150px;
  height: 25px;
}
.audioControls {
  margin: 0 auto;
}

.playPauseContainer {
  margin: 20px auto 0px auto;
  display: table;
}

.play {
  cursor: pointer;
  width: 60px;
  height: 60px;
  background: url("../assets/icons/baseline-play_circle_outline-24px.svg");
  background-size: 60px 60px;
}

.pause {
  cursor: pointer;
  width: 60px;
  height: 60px;
  background: url("../assets/icons/baseline-pause_circle_outline-24px.svg");
  background-size: 60px 60px;
}
.seekerSlider {
  width: 100%;
}
</style>
