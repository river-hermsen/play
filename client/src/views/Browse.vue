<template>
  <div>
    <div class="header">
      <h1>Hi {{this.userInfo.username}}</h1>
    </div>
    <div class="content">
      {{podcasts.mostPopular}}
      <div class="mostPopular">
        <!-- <div v-if="podcasts.mostPopular[0]"> -->
        <div v-for="podcast in podcasts.mostPopular" v-bind:key="podcast.id">{{podcast.title}}</div>
        <!-- </div> -->
      </div>
      <!-- <div class="randomgenres">{{this.$store.getters.getGenres}}</div> -->
    </div>
  </div>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      userInfo: {
        username: "",
        email: ""
      },
      podcasts: {
        genres: this.$store.getters.getGenres,
        mostPopular: [
          {
            id: 8,
            title: "NO"
          }
        ]
      }
    };
  },
  created() {
    if (this.$store.getters.getMostPopularPodcasts[0]) {
      this.podcasts.mostPopular = this.$store.getters.getMostPopularPodcasts[0].podcasts;
    } else {
    }

    // Fetch most popular Podcasts
    var mostPopularPodcasts = this.$store.getters.getMostPopularPodcasts;
    if (!mostPopularPodcasts[0]) {
      axios
        .get("https://listen-api.listennotes.com/api/v2/best_podcasts", {
          headers: { "X-ListenAPI-Key": "2e2c4f39b7b44659b73cb3b31f95236e" }
        })
        .then(res => {
          console.log("Fetched most popular podcasts from API.");
          this.$store.commit("addMostPopularPodcasts", res.data);
          this.podcasts.mostPopular = res.data;
          console.log(this.podcasts.mostPopular);
        })
        .catch(err => {
          console.log(err);
        });
    } else {
      console.log("Most popular podcasts already fetched and in VUEX state.");
    }

    var genres = this.$store.getters.getGenres;
    // Fetch genres only if not in VUEX store
    if (!genres[0]) {
      axios
        .get("https://listen-api.listennotes.com/api/v2/genres", {
          headers: { "X-ListenAPI-Key": "2e2c4f39b7b44659b73cb3b31f95236e" }
        })
        .then(res => {
          console.log("Fetched genres from API.");
          this.$store.commit("addGenres", res.data);
        })
        .catch(err => {
          console.log(err);
        });
    } else {
      console.log("Genres already fetched and in VUEX state.");
    }
  },
  mounted() {
    // Get user info
    this.$store.dispatch("getUserInfo").then(userInfo => {
      this.userInfo.username = userInfo.username;
      this.userInfo.email = userInfo.email;
    });

    // Fetch best podcast by random genres
    // axios.get();
  }
};
</script>
