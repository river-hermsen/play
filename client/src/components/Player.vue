<template>
  <div class="row">
    <div class="col-md-6" id="playerImgTitle">
      <div class="img-container">
        <img
          src="https://cdn-images-1.listennotes.com/podcasts/the-catch-and-kill-podcast-with-ronan-fkVtdOEUiX2-vLjmbQzHGxq.300x300.jpg"
          alt
        />
      </div>
      <div class="title-container">
        <span class="title">
          <b>Episode 3: The Wire</b>
        </span>
        <br />
        <p class="podcast">The Catch and Kill Podcast with Ronan Farrow</p>
      </div>
    </div>
    <div class="col-md-12" id="playerControls">
      <div class="top-controls">
        <div @click="skipBack()" class="controlContainer">
          <i class="icon icon-skip-back"></i>
        </div>
        <div class="playPauseContainer">
          <div @click="play" v-if="!isPlaying" class="controlContainer">
            <i class="icon icon-play"></i>
          </div>
          <div @click="pause" v-else-if="isPlaying" class="controlContainer">
            <i class="icon icon-pause"></i>
          </div>
        </div>
        <div @click="skipForward()" class="controlContainer">
          <i class="icon icon-skip-forward"></i>
        </div>
      </div>
      <div class="bottom-controls">
        <span>{{formattedCurrenPosAudio ? formattedCurrenPosAudio : '0:00'}}</span>
        <at-slider v-model="currentPosAudio" :max="lengthAudio" class="sliderAudio"></at-slider>
        <span>{{formattedLength ? formattedLength : '00:00'}}</span>
      </div>
    </div>
    <div class="col-md-6"></div>
  </div>
</template>

<style lang="scss" scoped>
#playerImgTitle {
  display: flex;
  .img-container {
    height: 100px;
    display: flex;
    align-items: center;
    float: left;
    img {
      height: 80px;
      margin-left: 10px;
    }
  }
  .title-container {
    margin-top: 15px;
    padding-left: 15px;
    float: left;
    .title {
      font-size: 1rem;
    }
  }
}

#playerControls {
  font-size: 2rem;
  padding: 0 1rem 1rem 1rem;
  display: flex;
  justify-content: center;
  flex-direction: column;
  .top-controls {
    display: flex;
    align-items: center;
    justify-content: center;
    .controlContainer {
      margin: 0 0.7rem 0 0.7rem;
    }
  }
  .bottom-controls {
    display: flex;
    justify-content: flex-start;
    font-size: 0.4em;
    .sliderAudio {
      flex-basis: 100%;
      margin-right: 1rem;
      margin-left: 1rem;
    }
  }
}
</style>

<script>
/* eslint-disable semi */
import { globalMixin } from '../sevices/_helper';

export default {
  name: 'Player',
  mixins: [globalMixin],
  data: () => {
    return {
      loaded: false,
      audioTrack:
        'https://www.listennotes.com/e/p/ec7eff6b8e7347c9affd894b1f06a123/',
      isPlaying: false,
      audioElement: new Audio(),
      currentPosAudio: 0,
      lengthAudio: 2312,
      formattedLength: '',
      formattedCurrenPosAudio: ''
    };
  },
  beforeMount () {
    if (this.audioElement.src === '') {
      this.audioElement.src = this.audioTrack;
    }
    this.audioElement.addEventListener('loadedmetadata', event => {
      this.loadedAudio();
    });

    this.audioElement.addEventListener('timeupdate', event => {
      this.timeUpdate();
    });
  },
  mounted () {},
  methods: {
    loadedAudio () {
      this.formattedLength = globalMixin.methods._formatTime(
        Math.trunc(this.audioElement.duration)
      );

      this.currentPosAudio = this.audioElement.currentTime;
      this.loaded = true;
    },
    timeUpdate () {
      this.currentPosAudio = this.audioElement.currentTime;
      this.formattedCurrenPosAudio = globalMixin.methods._formatTime(
        Math.trunc(this.audioElement.currentTime)
      );
    },
    play () {
      console.log(this.audioElement.currentTime);
      if (this.loaded) {
        this.audioElement.play();
        this.isPlaying = true;
      }
    },
    pause () {
      if (this.loaded) {
        this.audioElement.pause();
        this.isPlaying = false;
      }
    },
    skipBack () {},
    skipFoward () {}
  },
  computed: {
    currentTimeAudio () {
      return this.audioElement.currentTime;
    }
  }
};
</script>
