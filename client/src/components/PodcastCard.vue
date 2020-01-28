<template>
  <router-link :to="'/podcast/' + podcastId" tag="div">
    <el-card class="podcast-card" shadow="hover">
      <div>
        <img style="width: 100%" :src="thumbnail" @load="loadedImg()" v-show="!isLoading" />
        <div class="loading-img loading" v-if="isLoading"></div>
        <div>
          <span class="title" :title="title">
            <b>{{title}}</b>
          </span>
          <!-- <div class="extra-info"> -->
          <span class="genre" :title="mainGenre">{{mainGenre}}</span>
          <!-- </div> -->
        </div>
      </div>
    </el-card>
  </router-link>
</template>

<style lang="scss" scoped>
.podcast-card {
  // max-height: 280px;
  margin-bottom: 6px;
  cursor: pointer;
  .loading-img {
    padding-bottom: 100%;
    position: relative;
  }
  .title {
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  .genre {
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
}
</style>

<script>
export default {
  props: ['podcastId', 'title', 'thumbnail', 'mainGenre'],
  data() {
    return {
      isLoading: true,
    };
  },
  methods: {
    loadedImg() {
      this.isLoading = false;
    },
  },
};
</script>
