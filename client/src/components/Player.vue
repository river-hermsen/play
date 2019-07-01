<template>
  <div id="player">
    <audio
      id="audioPlayer"
      :src="audioSrc"
      type="audio/mp3"
      :onplay="getTotalTime()"
      @timeupdate="currentTimeInSeconds = $event.target.currentTime"
      ref="audioElement"
    ></audio>
    <div class="audioControls">
      <div class="playPauseContainer">
        <div @click="playPauseEpisode" :class="{pause: isPlaying, play: !isPlaying}"></div>
      </div>

      <div class="seekAudio">
        <div class="containerCurrentAndTotal">
          <span
            id="currentTime"
          >{{new Date(currentTimeInSeconds * 1000).toISOString().substr(14, 5)}}</span> /
          <span id="totalTime">{{new Date(totalTimeInSeconds * 1000).toISOString().substr(14, 5)}}</span>
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
    <el-button @click="test">test buttn</el-button>
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
    this.audioElement.addEventListener("play", event => {
      this.audioElement.play();
      console.log(event);
    });
    // this.audioElementReadyState = this.$refs.audioElement.readyState;
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
    },
    test() {
      console.log(this.$store.getters.getAudio);
    },
    play() {
      this.audioElement.play();
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
    },
    audioReadyState() {
      // console.log(this.audioElement.readyState);

      return this.audioElement.readyState;
    }
  },
  watch: {
    audioVuex(newAudio, oldAudio) {
      this.audioSrc = newAudio;
      this.title = this.$store.state.audioPlayer.title;
      this.totalTimeInSeconds = this.$store.state.audioPlayer.totalTime;
      this.thumbnailSrc = this.$store.state.audioPlayer.thumbnailSrc;
      this.podcast = this.$store.state.audioPlayer.podcast;
      new Promise((resolve, reject) => {});
      this.audioElement.load();
      if (!this.isPlaying) {
        this.isPlaying = true;
      }
    },
    audioReadyState(newAnd, oldAnd) {
      console.log(newAnd);

      console.log("Ready state changed");
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
  display: flex;
}

.audioControls {
  margin: 0 auto;
  width: 800px;
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
  float: right;
  width: 690px;
}

.containerCurrentAndTotal {
  position: relative;
  top: 12px;
  display: inline;
  float: left;
}
</style>
