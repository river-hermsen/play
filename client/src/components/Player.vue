<template>
  <div id="player">
    <audio
      id="audioPlayer"
      src="https://content.production.cdn.art19.com/validation=1562015344,832752e4-ef8b-5495-8201-3afd31e1c4e1,NwzvPLAx0yc6FPHnWhCEgJ_IxjU/episodes/fdd53ac3-ffe4-4413-8954-4444467845e1/41e96bd177a2a8bf20673a875ec5e194549291dc19bd5cdaf3835b921b87ca6b4e9a9745f49f6e563354c1cf79abcdec2e9f3d17f92b9f6247c2118d540ba5b2/1865-03-InsideTheEpisode-190624-wls.mp3"
      type="audio/mp3"
      :onplay="getTotalTime()"
      @timeupdate="currentTimeInSeconds = $event.target.currentTime"
      ref="audioElement"
      preload="auto"
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
      audioSrc:
        "https://content.production.cdn.art19.com/validation=1562015344,832752e4-ef8b-5495-8201-3afd31e1c4e1,NwzvPLAx0yc6FPHnWhCEgJ_IxjU/episodes/fdd53ac3-ffe4-4413-8954-4444467845e1/41e96bd177a2a8bf20673a875ec5e194549291dc19bd5cdaf3835b921b87ca6b4e9a9745f49f6e563354c1cf79abcdec2e9f3d17f92b9f6247c2118d540ba5b2/1865-03-InsideTheEpisode-190624-wls.mp3",
      isPlaying: false,
      currentTimeInSeconds: 0,
      currentTimeFormated: 0,
      totalTimeInSeconds: 0,
      totalTimeFormated: 0
    };
  },
  mounted() {
    this.audioElement = this.$refs.audioElement;
    this.audioElementReadyState = this.$refs.audioElement.readyState;
  },
  methods: {
    playPauseEpisode() {
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
      console.log(this.$store.state);
    }
  },
  computed: {
    formattedCurrentTime() {},
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
