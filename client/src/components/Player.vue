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
    <div class="col-md-18" id="playerControls">
      <i class="icon icon-play" @click="play"></i>
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
    margin-top: 15px;
    padding-left: 15px;
    float: left;
    .title {
      font-size: 1rem;
    }
  }
}

#playerControls {
  text-align: center;
}
</style>

<script>
/* eslint-disable semi */
import { globalMixin } from '../sevices/_helper';

export default {
  name: 'Podcast',
  mixins: [globalMixin],
  data: () => {
    return {
      audioTrack:
        'https://www.listennotes.com/e/p/ec7eff6b8e7347c9affd894b1f06a123/',
      isPlaying: false,
      audioElement: new Audio()
    };
  },
  methods: {
    play () {
      this.audioElement.src = this.audioTrack;
      this.audioElement.play();
      this.isPlaying = true;
    }
  }
};
</script>
