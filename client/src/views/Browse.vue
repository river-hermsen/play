<template>
  <div>
    <h1>Hi {{this.userInfo.username}}</h1>
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
        genres: {}
      }
    };
  },
  mounted() {
    // Get user info
    this.$store.dispatch("getUserInfo").then(userInfo => {
      this.userInfo.username = userInfo.username;
      this.userInfo.email = userInfo.email;
    });

    // Fetch most popular Podcasts
    axios
      .get("https://listen-api.listennotes.com/api/v2/best_podcasts", {
        headers: { "X-ListenAPI-Key": "2e2c4f39b7b44659b73cb3b31f95236e" }
      })
      .then(res => {
        console.log(res);
        this.podcasts.best = res.data.podcasts;
      })
      .catch(err => {
        console.log(err);
      });

    // Fetch genres only if not in VUEX store
    if (!this.$store.state.podcasts.genres) {
      axios
        .get("https://listen-api.listennotes.com/api/v2/genres", {
          headers: { "X-ListenAPI-Key": "2e2c4f39b7b44659b73cb3b31f95236e" }
        })
        .then(res => {
          console.log(res);
          this.$store.commit("addGenres", res.data.genres);
        })
        .catch(err => {
          console.log(err);
        });
    } else {
      console.log("Genres already in VUEX state.");
    }
  },
  methods: {}
};
</script>
