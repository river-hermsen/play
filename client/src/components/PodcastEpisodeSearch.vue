<template>
  <el-row class="episode" :gutter="8">
    <el-col :span="2" class="image-container">
      <div class="loading-img loading" v-if="isLoading"></div>
      <router-link
        :to="'/podcast/' + podcastId + '?episode=' + encodeURIComponent(episodeTitle)"
        v-show="!isLoading"
      >
        <img :src="image" @load="loadedImg()" />
      </router-link>
    </el-col>
    <el-col :span="8">
      <router-link
        :to="'/podcast/' + podcastId + '?episode=' + encodeURIComponent(episodeTitle)"
        tag="div"
        class="episode-title-container"
      >
        <h4 class="episode-title">{{episodeTitle}}</h4>
      </router-link>

      <div>
        <router-link
          :to="'/podcast/' + podcastId"
          tag="div"
          class="episode-podcast-title-container"
        >
          <span>{{podcastTitle}}</span>
        </router-link>
      </div>
    </el-col>
    <el-col :span="11" class="description" :id="episodeId">
      <p @click="showHideDescription(episodeId)">{{description}}</p>
    </el-col>
    <el-col :span="3">
      <p>{{formatDate(msToDate(pubDateMS), true)}}</p>
    </el-col>
  </el-row>
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
  .episode-title-container {
    cursor: pointer;
    .episode-title {
      margin: unset;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      overflow: hidden;
    }
  }
  .episode-podcast-title-container {
    cursor: pointer;
    &:hover {
      text-decoration: underline;
    }
  }

  .description {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 4;
    overflow: hidden;
    cursor: pointer;
    p {
      margin: unset;
    }
  }
  .description-show {
    -webkit-line-clamp: unset;
    height: 140px;
    overflow-y: scroll;
  }
}
</style>

<script>
import globalMixin from '../sevices/_helper';

export default {
  props: [
    'episodeId',
    'podcastId',
    'episodeTitle',
    'podcastTitle',
    'image',
    'description',
    'pubDateMS',
  ],
  mixins: [globalMixin],
  data() {
    return {
      isLoading: true,
    };
  },
  methods: {
    showHideDescription(epsiodeId) {
      console.log(epsiodeId);

      document.getElementById(epsiodeId).classList.toggle('description-show');
    },
    loadedImg() {
      this.isLoading = false;
    },
  },
};
</script>
