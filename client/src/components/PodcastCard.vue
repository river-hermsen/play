<template>
  <router-link :to="'podcast/' + podcastId" tag="div">
    <at-card class="podcast-card">
      <div>
        <img style="width: 100%" :src="thumbnail" />
        <div style="padding: 6px;">
          <span class="title">
            <b>{{title}}</b>
          </span>
          <div class="extra-info">
            <span class="genre">{{mainGenre}}</span>
          </div>
        </div>
      </div>
    </at-card>
  </router-link>
</template>

<style lang="scss" scoped>
.podcast-card {
  height: 280px;
  margin-bottom: 6px;
  cursor: pointer;
  .title {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  .extra-info {
    position: absolute;
    bottom: 12px;
    width: 141px;
  }
}
</style>

<script>
export default {
  props: ['podcastId', 'title', 'thumbnail', 'mainGenre']
}
</script>
