<template>
  <el-row class="loading-episode" :gutter="8">
    <el-col :span="2">
      <div class="image loading"></div>
    </el-col>
    <el-col :span="8">
      <div class="episode-title loading"></div>
      <div class="podcast-title loading"></div>
    </el-col>
    <el-col :span="11">
      <div class="description loading"></div>
      <div class="description-last-line loading"></div>
    </el-col>
    <el-col :span="3">
      <div class="pubDate loading"></div>
    </el-col>
  </el-row>
</template>

<script>
export default {};
</script>

<style lang="scss">
.loading-episode {
  border-bottom: 1px solid #ebebeb;
  padding: 0.5rem 0 0.5rem 0;

  .image {
    width: 100%;
    height: 76px;
  }
  .episode-title {
    width: 250px;
    height: 21px;
  }
  .podcast-title {
    width: 211px;
    height: 19px;
    margin-top: 0.4rem;
  }
  .description {
    width: 390px;
    height: 42px;
  }
  .description-last-line {
    width: 330px;
    height: 21px;
  }
  .pubDate {
    width: 104px;
    height: 21px;
  }
}
</style>
