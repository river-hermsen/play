<template>
  <div class="row">
    <div class="col-md-6" id="playerImgTitle">
      <div class="img-container">
        <img :src="episodeInfo.image" alt="Podcast info" v-if="episodeInfo.image" />
      </div>
      <div class="title-container">
        <span class="title" :title="episodeInfo.title">
          <b>{{episodeInfo.title}}</b>
        </span>
        <p class="podcast">{{episodeInfo.podcast_title}}</p>
      </div>
    </div>
    <div class="col-md-12" id="playerControls">
      <div class="top-controls">
        <!-- <div @click="skipBack()" class="controlContainer">
          <i class="icon icon-skip-back"></i>
        </div>-->
        <div class="playPauseContainer">
          <div @click="play" v-if="!isPlaying && !isLoading " class="controlContainer">
            <i class="icon icon-play"></i>
          </div>
          <div @click="pause" v-else-if="isPlaying && !isLoading" class="controlContainer">
            <i class="icon icon-pause"></i>
          </div>
          <div v-else-if="isLoading" class="controlContainer loading-episode-icon">
            <i class="icon icon-loader"></i>
          </div>
        </div>
        <!-- <div @click="skipForward()" class="controlContainer">
          <i class="icon icon-skip-forward"></i>
        </div>-->
      </div>
      <div class="bottom-controls">
        <span>{{formattedCurrenPosAudio ? formattedCurrenPosAudio : '0:00'}}</span>
        <at-slider
          v-model="currentPosAudio"
          :max="lengthAudio"
          class="sliderAudio"
          @click.native="seeking"
        ></at-slider>
        <span>{{formattedLength ? formattedLength : '0:00'}}</span>
      </div>
    </div>
    <div class="col-md-6" id="playerRightControls">
      <div class="volume-container">
        <div class="volume-icon" @click="toggleMuteVolume">
          <i class="icon icon-volume-1" v-if="!mutedVolume && volumeLevel >= 50"></i>
          <i class="icon icon-volume-2" v-if="!mutedVolume && volumeLevel < 50"></i>
          <i class="icon icon-volume-x" v-else-if="mutedVolume"></i>
        </div>
        <div class="slider">
          <at-slider v-model="volumeLevel" :max="100" class="slider-volume" :disabled="mutedVolume"></at-slider>
        </div>
      </div>
      <div class="maximize-icon">
        <i class="icon icon-maximize-2"></i>
      </div>
    </div>
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
    margin-top: 8px;
    padding-left: 15px;
    float: left;
    .title {
      font-size: 1rem;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
    .podcast {
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
      font-size: 0.9em;
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
    .loading-episode-icon {
      -webkit-animation-name: spin;
      -webkit-animation-duration: 3000ms;
      -webkit-animation-iteration-count: infinite;
      -webkit-animation-timing-function: linear;
    }
    @-webkit-keyframes spin {
      from {
        -webkit-transform: rotate(0deg);
      }
      to {
        -webkit-transform: rotate(360deg);
      }
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

#playerRightControls {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 0 2.5rem 0 4rem;
  font-size: 1.4rem;
  .volume-container {
    flex-basis: 130px;
    display: flex;
    justify-content: center;
    align-items: center;
    .volume-icon {
      cursor: pointer;
    }
  }
  .slider {
    flex-basis: 100%;
    padding: 0rem 1rem 0 0.75rem;
  }
  .maximize-icon {
    cursor: pointer;
    margin-left: 1rem;
  }
}
</style>

<script>
import { globalMixin } from '../sevices/_helper';

export default {
  name: 'Player',
  mixins: [globalMixin],
  data: () => {
    return {
      isLoading: null,
      episodeInfo: {
        title: null,
        podcast: null,
        image: null
      },
      isPlaying: false,
      audioElement: new Audio(),
      volumeLevel: 100,
      mutedVolume: false,
      currentPosAudio: 0,
      currentPosSlider: 0,
      lengthAudio: null,
      timeFormat: null,
      formattedLength: '',
      formattedCurrenPosAudio: ''
    };
  },
  methods: {
    loadedAudio () {
      if (this.audioElement.duration > 60 * 60) {
        this.timeFormat = 'HH:MM:SS';
      } else {
        this.timeFormat = 'MM:SS';
      }
      this.formattedLength = globalMixin.methods._formatTime(
        Math.trunc(this.audioElement.duration),
        this.timeFormat
      );

      this.lengthAudio = Math.trunc(this.audioElement.duration);
      this.isLoading = false;
      this.play();
    },
    timeUpdate () {
      this.currentPosAudio = Math.trunc(this.audioElement.currentTime);

      this.formattedCurrenPosAudio = globalMixin.methods._formatTime(
        Math.trunc(this.audioElement.currentTime),
        this.timeFormat
      );
    },
    play () {
      if (this.episodeInfo.title) {
        this.audioElement.play();
        this.isPlaying = true;
      }
    },
    pause () {
      this.audioElement.pause();
      this.isPlaying = false;
    },
    seeking () {
      this.audioElement.currentTime = this.currentPosAudio;
    },
    toggleMuteVolume () {
      this.mutedVolume = !this.mutedVolume;

      if (this.mutedVolume) {
        this.audioElement.volume = 0;
      } else {
        if (this.volumeLevel === 0) {
          this.volumeLevel = 65;
        }
        this.audioElement.volume = this.volumeLevel / 100;
      }
    }
  },
  computed: {
    currentTimeAudio () {
      return this.audioElement.currentTime;
    },
    episodeVuex () {
      return this.$store.getters.getCurrentEpisode;
    }
  },
  watch: {
    volumeLevel () {
      if (this.volumeLevel === 0) {
        this.toggleMuteVolume();
      } else {
        this.mutedVolume = false;
        this.audioElement.volume = this.volumeLevel / 100;
      }
    },
    episodeVuex (newEpisode) {
      console.log(newEpisode);

      this.isLoading = true;
      this.isPlaying = false;
      this.lengthAudio = 0;
      this.episodeInfo = {
        title: newEpisode.title,
        image: newEpisode.image,
        podcast_title: newEpisode.podcast_title
      };
      this.audioElement.src = newEpisode.audio;
      this.audioElement.addEventListener('loadedmetadata', event => {
        this.loadedAudio();
      });

      this.audioElement.addEventListener('timeupdate', event => {
        this.timeUpdate();
      });
    }
  }
};
</script>
