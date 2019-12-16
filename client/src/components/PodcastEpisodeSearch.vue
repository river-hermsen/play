<template>
  <div class="row episode">
    <div class="col-md-3 image-container">
      <div class="loading-img loading" v-if="isLoading"></div>
      <router-link
        :to="'/podcast/' + podcastId + '?episode=' + encodeURIComponent(episodeTitle)"
        v-show="!isLoading"
      >
        <img :src="image" @load="loadedImg()" />
      </router-link>
    </div>
    <div class="col-md-7">
      <h4>{{podcastTitle}}:</h4>
      <div>
        <span>{{episodeTitle}}</span>
      </div>
    </div>
    <div class="col-md-11 description" :id="episodeId" @click="showHideDescription(episodeId)">
      <p>{{description}}</p>
    </div>
    <div class="col-md-3">
      <p>{{_formatDate(_msToDate(pubDateMS))}}</p>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.episode {
  border-bottom: 1px solid #ebebeb;
  padding: 0.5rem 0 0.5rem 0;
  .image-container {
    cursor: pointer;
    .loading-img {
      width: 104px;
      height: 104px;
    }
    img {
      width: 100%;
    }
  }
  .description {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 5;
    overflow: hidden;
    cursor: pointer;
  }
  .description-show {
    -webkit-line-clamp: unset;
    height: 140px;
    overflow-y: scroll;
  }
}
</style>

<script>
import { globalMixin } from '../sevices/_helper';

export default {
  props: [
    'episodeId',
    'podcastId',
    'episodeTitle',
    'podcastTitle',
    'image',
    'description',
    'pubDateMS'
  ],
  mixins: [globalMixin],
  data () {
    return {
      isLoading: true
    };
  },
  methods: {
    showHideDescription (epsiodeId) {
      document.getElementById(epsiodeId).classList.toggle('description-show');
    },
    loadedImg () {
      this.isLoading = false;
    }
  }
};
</script>
