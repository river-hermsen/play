<template>
  <div id="player">
    <audio id="audioPlayer">
      <source
        src="https://content.production.cdn.art19.com/validation=1562015344,832752e4-ef8b-5495-8201-3afd31e1c4e1,NwzvPLAx0yc6FPHnWhCEgJ_IxjU/episodes/fdd53ac3-ffe4-4413-8954-4444467845e1/41e96bd177a2a8bf20673a875ec5e194549291dc19bd5cdaf3835b921b87ca6b4e9a9745f49f6e563354c1cf79abcdec2e9f3d17f92b9f6247c2118d540ba5b2/1865-03-InsideTheEpisode-190624-wls.mp3"
        type="audio/mp3"
      >
    </audio>
    <div class="audioControls">
      <div class="playPauseContainer">
        <div class="play" @click="playPauseEpisode" v-show="!isPlaying"></div>
        <div class="pause" @click="playPauseEpisode" v-show="isPlaying"></div>
      </div>
      <div class="seekAudio">
        <div class="containerCurrentAndTotal">
          <span id="currentTime">0:00</span>/
          <span id="totalTime">0:00</span>
        </div>

        <div class="seekerSlider">
          <el-slider v-model="currentTimeInSeconds" :show-tooltip="false"></el-slider>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isPlaying: false,
      currentTimeInSeconds: 0,
      curretTimeFormated: 0,
      totalTimeInSeconds: 0,
      totalTimeFormated: 0
    };
  },
  methods: {
    playPauseEpisode() {
      var audioElement = document.getElementById("audioPlayer");
      if (this.isPlaying) {
        audioElement.pause();
        this.isPlaying = false;
      } else if (!this.isPlaying) {
        audioElement.play();
        this.isPlaying = true;
      } else {
        console.error("Error playing or pausing");
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
  width: 60px;
  height: 60px;
  background: url("../assets/icons/baseline-play_circle_outline-24px.svg");
  background-size: 60px 60px;
}

.pause {
  width: 60px;
  height: 60px;
  background: url("../assets/icons/baseline-pause_circle_outline-24px.svg");
  background-size: 60px 60px;
}

.seekerSlider {
  float: right;
  width: 700px;
}

.containerCurrentAndTotal {
  position: relative;
  top: 12px;
  display: inline;
  float: left;
}
</style>
