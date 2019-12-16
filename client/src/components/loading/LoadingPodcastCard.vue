<template>
  <el-card class="card" shadow="hover">
    <div>
      <div class="loading image" />
      <div class="text-info">
        <div class="title loading"></div>
        <div class="second-title loading"></div>
        <div class="extra-info">
          <div class="genre loading"></div>
        </div>
      </div>
    </div>
  </el-card>
</template>

<style lang="scss" scoped>
.card {
  margin-top: 10px;
  .image {
    padding-bottom: 100%;
    position: relative;
  }
  .text-info {
    margin-top: 6px;
    .title {
      height: 19px;
      width: 100%;
      margin-bottom: 2px;
    }
    .second-title {
      height: 19px;
      width: 60%;
      margin-bottom: 9px;
    }
    .genre {
      width: 100px;
      height: 15px;
    }
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
export default {};
</script>
