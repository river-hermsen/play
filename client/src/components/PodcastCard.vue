<template>
  <router-link :to="'/podcast/' + podcastId" tag="div">
    <at-card class="podcast-card">
      <div>
        <img style="width: 100%" :src="thumbnail" @load="test()" v-show="!isLoading" />
        <div class="loading-img loading" v-if="isLoading"></div>
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
  .loading-img {
    min-width: 166px;
    min-height: 166px;
  }
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

.loading {
  -webkit-animation-duration: 1s;
  -webkit-animation-fill-mode: forwards;
  -webkit-animation-iteration-count: infinite;
  -webkit-animation-name: placeHolderShimmer;
  -webkit-animation-timing-function: linear;
  background: #f6f7f8;
  background-image: -webkit-gradient(
    linear,
    left center,
    right center,
    from(#f6f7f8),
    color-stop(0.2, #edeef1),
    color-stop(0.4, #f6f7f8),
    to(#f6f7f8)
  );
  background-image: -webkit-linear-gradient(
    left,
    #f6f7f8 0%,
    #edeef1 20%,
    #f6f7f8 40%,
    #f6f7f8 100%
  );
  background-repeat: no-repeat;
  border-radius: 2px;
}

@-webkit-keyframes placeHolderShimmer {
  0% {
    background-position: -468px 0;
  }

  100% {
    background-position: 468px 0;
  }
}
</style>

<script>
export default {
  props: ['podcastId', 'title', 'thumbnail', 'mainGenre'],
  data () {
    return {
      isLoading: true
    };
  },
  methods: {
    test () {
      this.isLoading = false;
      console.log('loaded');
    }
  }
};
</script>
