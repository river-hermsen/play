<template>
  <el-row>
    <el-col :span="6">
      <div id="playerImgTitle">
        <div class="img-container">
          <img :src="episodeInfo.image" alt="Podcast info" v-if="episodeInfo.image" />
        </div>
        <div class="title-container">
          <span class="title" :title="episodeInfo.title">
            <b>{{episodeInfo.title}}</b>
          </span>
          <router-link
            :to="'/podcast/' + episodeInfo.podcastId"
            tag="p"
            class="podcast"
          >{{episodeInfo.podcast_title}}</router-link>
        </div>
      </div>
    </el-col>
    <el-col :span="12">
      <div id="playerControls">
        <div class="top-controls">
          <div class="playPauseContainer">
            <div @click="play" v-if="!isPlaying && !isLoading " class="controlContainer">
              <img src="../assets/icons/playback/play_circle.svg" alt class="control-icon" />
            </div>
            <div @click="pause" v-else-if="isPlaying && !isLoading" class="controlContainer">
              <img src="../assets/icons/playback/pause_circle.svg" alt class="control-icon" />
            </div>
            <div v-else-if="isLoading" class="controlContainer loading-episode-icon">
              <i class="el-icon-loading"></i>
            </div>
          </div>
        </div>
        <div class="bottom-controls">
          <span>{{formattedCurrentPosAudio ? formattedCurrentPosAudio : '0:00'}}</span>
          <el-slider
            v-model="currentPosAudio"
            :max="lengthAudio"
            :show-tooltip="false"
            class="sliderAudio"
            @mousedown.native="seeking()"
            @mouseup.native="seekingRelease()"
          ></el-slider>
          <span>-{{formattedTimeToEnd ? formattedTimeToEnd : '0:00'}}</span>
        </div>
      </div>
    </el-col>
    <el-col :span="6">
      <div id="playerRightControls">
        <div class="volume-container">
          <div class="volume-icon" @click="toggleMuteVolume">
            <img
              src="../assets/icons/playback/volume_up.svg"
              v-if="!mutedVolume && volumeLevel >= 50"
              class="control-icon"
            />
            <img
              src="../assets/icons/playback/volume_down.svg"
              v-else-if="!mutedVolume && volumeLevel < 50"
              class="control-icon"
            />
            <img
              src="../assets/icons/playback/volume_off.svg"
              v-else-if="mutedVolume"
              class="control-icon"
            />
          </div>
          <div class="slider">
            <el-slider
              v-model="volumeLevel"
              :max="100"
              :show-tooltip="false"
              :disabled="mutedVolume"
              class="slider-volume"
            ></el-slider>
          </div>
        </div>
        <div class="maximize-icon">
          <i class="icon icon-maximize-2"></i>
        </div>
      </div>
    </el-col>
  </el-row>
</template>

<style lang="scss">
.control-icon {
  -webkit-user-drag: none;
  -webkit-user-select: none;
}
#playerImgTitle {
  display: flex;
  .img-container {
    height: 110px;
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
      font-size: 1.15rem;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
    .podcast {
      display: -webkit-box;
      width: fit-content;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      cursor: pointer;
      overflow: hidden;
      margin-top: 0.1rem;
      font-size: 1.05em;
      &:hover {
        text-decoration: underline;
      }
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
      height: 48px;
      margin-top: 10px;
      cursor: pointer;
      img {
        width: 3rem;
      }
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
    align-items: center;
    font-size: 0.4em;
    .sliderAudio {
      flex-basis: 100%;
      margin-right: 1rem;
      margin-left: 1rem;
    }
  }
}

#playerRightControls {
  height: 110px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 0 2.5rem 0 4rem;
  font-size: 1.4rem;
  .volume-container {
    flex-basis: 150px;
    display: flex;
    justify-content: center;
    align-items: center;
    .volume-icon {
      cursor: pointer;
      height: 24px;
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
/* eslint-disable max-len */

import globalMixin from '../sevices/_helper';

const Store = require('electron-store');

const ElectronStore = new Store();

export default {
  name: 'Player',
  mixins: [globalMixin],
  data: () => ({
    isLoading: null,
    episodeInfo: {
      id: null,
      title: null,
      podcast: null,
      image: null,
    },
    isPlaying: false,
    audioElement: new Audio(),
    volumeLevel: 100,
    mutedVolume: false,
    currentPosAudio: 0,
    timeToEnd: null,
    formattedTimeToEnd: '',
    isSeeking: false,
    lengthAudio: null,
    timeFormat: null,
    formattedLength: '',
    formattedCurrentPosAudio: '',
  }),
  methods: {
    loadedAudio() {
      const recentlyPlayedEpisodes = ElectronStore.get(
        'recentlyPlayedEpisodes',
      );

      if (recentlyPlayedEpisodes) {
        if (!recentlyPlayedEpisodes.includes(this.episodeInfo.id)) {
          const recentAdded = recentlyPlayedEpisodes.concat({
            id: this.episodeInfo.id,
            time: 0,
          });
          if (recentlyPlayedEpisodes.length >= 50) {
            recentAdded.shift();
          }
          ElectronStore.set('recentlyPlayedEpisodes', recentAdded);
        }
      } else {
        ElectronStore.set('recentlyPlayedEpisodes', [
          { id: this.episodeInfo.id, time: 0 },
        ]);
      }

      if (this.audioElement.duration > 60 * 60) {
        this.timeFormat = 'HH:MM:SS';
      } else {
        this.timeFormat = 'MM:SS';
      }
      this.formattedLength = globalMixin.methods.formatTime(
        Math.trunc(this.audioElement.duration),
        this.timeFormat,
      );

      this.lengthAudio = Math.trunc(this.audioElement.duration);
      this.isLoading = false;
      this.play();
      this.timeUpdate();
    },
    timeUpdate() {
      this.currentPosAudio = Math.trunc(this.audioElement.currentTime);
      const recentlyPlayedEpisodes = ElectronStore.get(
        'recentlyPlayedEpisodes',
      );

      const episodeIndex = recentlyPlayedEpisodes.findIndex(
        (episode) => episode.id === this.episodeInfo.id,
      );

      if (episodeIndex !== -1) {
        recentlyPlayedEpisodes[episodeIndex].time = Math.trunc(
          this.audioElement.currentTime,
        );
        ElectronStore.set('recentlyPlayedEpisodes', recentlyPlayedEpisodes);
      }

      this.timeToEnd = this.lengthAudio - this.currentPosAudio;
    },
    play() {
      if (this.episodeInfo.title) {
        this.audioElement.play();
        this.isPlaying = true;
        this.$store.commit('changePlayingState', true);
      }
    },
    pause() {
      if (this.episodeInfo.title) {
        this.audioElement.pause();
        this.isPlaying = false;
        this.$store.commit('changePlayingState', false);
      }
    },
    seeking() {
      this.pause();
      this.isSeeking = true;
    },
    seekingRelease() {
      this.play();
      this.isSeeking = false;
    },
    toggleMuteVolume() {
      this.mutedVolume = !this.mutedVolume;

      if (this.mutedVolume) {
        this.audioElement.volume = 0;
      } else {
        if (this.volumeLevel === 0) {
          this.volumeLevel = 65;
        }
        this.audioElement.volume = this.volumeLevel / 100;
      }
    },
  },
  computed: {
    episodeVuex() {
      return this.$store.getters.getCurrentEpisode;
    },
    playingStateInStore() {
      return this.$store.getters.getPlayingState;
    },
  },
  watch: {
    volumeLevel() {
      if (this.volumeLevel === 0) {
        this.toggleMuteVolume();
      } else {
        this.mutedVolume = false;
        this.audioElement.volume = this.volumeLevel / 100;
      }
    },
    currentPosAudio(newVal, oldVal) {
      if (newVal - oldVal > 1 || newVal - oldVal < 0) {
        this.audioElement.currentTime = this.currentPosAudio;
      }

      let secondsElapsedTrunc = Math.trunc(this.currentPosAudio);
      let secondsToEndTrunc = Math.trunc(this.timeToEnd);
      if (this.timeFormat === 'MM:SS') {
        // eslint-disable-next-line no-multi-spaces
        this.formattedCurrentPosAudio =          (secondsElapsedTrunc - (secondsElapsedTrunc %= 60)) / 60
          + (secondsElapsedTrunc > 9 ? ':' : ':0')
          + secondsElapsedTrunc;
        // eslint-disable-next-line no-multi-spaces
        this.formattedTimeToEnd =          (secondsToEndTrunc - (secondsToEndTrunc %= 60)) / 60
          + (secondsToEndTrunc > 9 ? ':' : ':0')
          + secondsToEndTrunc;
      } else {
        this.formattedCurrentPosAudio = new Date(secondsElapsedTrunc * 1000)
          .toISOString()
          .substr(11, 8);
        this.formattedTimeToEnd = new Date(secondsToEndTrunc * 1000)
          .toISOString()
          .substr(11, 8);
      }
    },
    episodeVuex(newEpisode) {
      console.log(newEpisode);

      this.isLoading = true;
      this.isPlaying = false;
      this.lengthAudio = 0;
      this.episodeInfo = {
        id: newEpisode.id,
        title: newEpisode.title,
        image: newEpisode.image,
        podcast_title: newEpisode.podcast_title,
        podcastId: newEpisode.podcastId,
      };
      this.audioElement.src = newEpisode.audio;
      const recentlyPlayedEpisodes = ElectronStore.get(
        'recentlyPlayedEpisodes',
      );
      if (recentlyPlayedEpisodes) {
        const currentEpisodeInStore = recentlyPlayedEpisodes.find((episode) => {
          console.log(newEpisode.id);
          console.log(episode.id);

          return episode.id === newEpisode.id;
        });
        if (currentEpisodeInStore) {
          this.audioElement.currentTime = currentEpisodeInStore.time;
        }
      }

      this.audioElement.addEventListener('loadedmetadata', () => {
        this.loadedAudio();
      });

      this.audioElement.addEventListener('timeupdate', () => {
        this.timeUpdate();
      });

      this.audioElement.addEventListener('ended', () => {
        this.pause();
      });

      this.audioElement.addEventListener('error', () => {
        this.$notify({
          title: 'Something went wrong',
          message:
            'Something went wrong trying to play the audio, please try again later.',
          position: 'bottom-right',
          type: 'error',
        });
      });
    },
    playingStateInStore(newVal) {
      console.log(newVal);

      if (newVal && !this.isLoading && !this.isPlaying) {
        this.audioElement.play();
        this.isPlaying = true;
      } else if (!this.isLoading && this.isPlaying) {
        this.audioElement.pause();
        this.isPlaying = false;
      }
    },
  },
};
</script>
