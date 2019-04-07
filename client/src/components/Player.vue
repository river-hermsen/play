<template>
  <div id="player">
    <el-button @click="playPauseMusic">Play or pause tha music</el-button>
    <input
      type="range"
      id="volume"
      min="0"
      :max="1"
      step="0.05"
      v-on:input="changeVolumeAudio"
      v-model="audio.volume"
    >
    <input
      type="range"
      id="volume"
      min="0"
      max="1"
      step="0.05"
      v-on:input="changeSeekAudio"
      v-model="audio.seek"
    >
  </div>
</template>

<script>
import { Howl, Howler } from "howler";

export default {
  data() {
    return {
      audioWebApi: {},
      audio: {
        isPlaying: false,
        isPaused: false,
        src: "http://localhost:8080/music/08 HUMBLE..mp3",
        track: "",
        lenghtString: "2:00",
        length: 200,
        albumCover: "",
        album: "",
        artist: "",
        currentTime: 0,
        volume: 1
      }
    };
  },
  mounted() {
    const track = new Howl({
      src: [this.audio.src]
    });
    this.track = track;
  },
  methods: {
    playPauseMusic() {
      if (!this.audio.isPlaying) {
        this.audio.id = this.track.play();
        this.audio.isPlaying = true;
      } else if (this.audio.isPlaying && !this.audio.isPaused) {
        this.track.pause();
        this.audio.isPaused = true;
      } else if (this.audio.isPaused) {
        this.track.play(this.audio.id);
        this.audio.isPaused = false;
      }
    },
    changeVolumeAudio() {
      Howler.volume(this.audio.volume);
    },
    changeSeekAudio() {
      this.track.seek(30, this.audio.id);
    }
  }
};
</script>


<style lang="scss">
#player {
  background-color: #ffffff;
  position: absolute;
  bottom: 0px;
  width: 100vw;
  height: 12vh;
  display: flex;
  #playerImg {
    padding: 0.5vh;
    img {
      width: 10vh;
    }
  }
  #playerInfo {
    display: flex;
    #playerInfoInner {
      margin: auto;
      text-align: center;
      #playerInfoTextHeader {
        margin: 0px;
      }
      #playerInfoTextSub {
        margin: 0px;
      }
    }
  }
}
</style>
