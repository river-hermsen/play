<template>
  <div id="podcastView">
    <el-card class="cardPodcastView">
      <div class="infoPodcastView">
        <div class="imagePodcastView">
          <img :src="podcastInfo.thumbnail" alt>
        </div>
        <div class="innerInfoPodcastView">
          <h1 class="titlePodcastView displayInline">{{podcastInfo.title}}</h1>
          <h4 class>Last publish: {{new Date(podcastInfo.latest_pub_date_ms).toLocaleDateString()}}</h4>
          <p class="descriptionPodcastView">{{podcastInfo.description}}</p>
        </div>
      </div>
    </el-card>
  </div>
</template>

<style>
#podcastView {
  max-width: 1080px;
  margin: 0 auto;
  min-height: 88vh;
}

.cardPodcastView {
  width: 100%;
  padding-left: 20px;
  padding-right: 50px;
  padding-top: 10px;
}

.imagePodcastView {
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);
  float: left;
  display: inline;
}

.displayInline {
  display: inline;
}

.innerInfoPodcastView {
  max-width: 618px;
  margin: 10px 0px 0px 40px;
  display: inline-block;
}

.titlePodcastView {
  font-size: 2.5rem;
}
</style>

<script>
import axios from "axios";

export default {
  data() {
    return {
      podcastInfo: {}
    };
  },
  created() {
    console.log(this.$route);

    // Fetch meta data of podcast
    axios
      .get(
        `https://listen-api.listennotes.com/api/v2/podcasts/${
          this.$route.params.id
        }`,
        {
          headers: { "X-ListenAPI-Key": "2e2c4f39b7b44659b73cb3b31f95236e" }
        }
      )
      .then(res => {
        console.log(res.data);
        this.podcastInfo = res.data;
      })
      .catch(err => {
        console.log(err);
      });
  }
};
</script>
