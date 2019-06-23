<template>
  <div>
    <div class="header">
      <h1>Hi {{this.userInfo.username}}</h1>
    </div>
    <el-divider></el-divider>
    <div class="content">
      <div class="mostPopular">
        <h2>Most Popular podcasts</h2>
        <el-row>
          <el-col
            v-for="podcast in podcasts.mostPopular.slice(0,8)"
            :key="podcast.id"
            :md="8"
            :lg="6"
            :xl="6"
          >
            <el-card class="cardPodcast">
              <img :src="podcast.thumbnail" class="imagePodcast">
              <div class="infoBoxPodcast">
                <div class="titlePodcast">
                  <b :title="podcast.title">{{podcast.title}}</b>
                </div>
                <div>
                  <span>
                    <span
                      class="genrePodcast"
                    >{{$store.getters.getGenreTitleById(podcast.genre_ids[0]).name}}</span>
                    <!-- <span
                      v-for="genre in podcast.genre_ids.slice(0, 1)"
                      :key="genre"
                    >{{$store.getters.getGenreTitleById(genre).name}}</span>-->
                  </span>
                  <span class="languagePodcast">{{podcast.language}}</span>
                </div>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </div>
      <el-divider></el-divider>

      <div class="randomgenres">
        <div>
          <h2>Best of {{podcasts.randomGenre.genre.name}}</h2>
          <el-row>
            <el-col
              v-for="podcast in podcasts.randomGenre.podcasts"
              :key="podcast.id"
              :md="8"
              :lg="6"
              :xl="6"
            >
              <el-card class="cardPodcast">
                <img :src="podcast.thumbnail" class="imagePodcast">
                <div class="infoBoxPodcast">
                  <div class="titlePodcast">
                    <b :title="podcast.title">{{podcast.title}}</b>
                  </div>
                  <div>
                    <span>
                      <span
                        class="genrePodcast"
                      >{{$store.getters.getGenreTitleById(podcast.genre_ids[0]).name}}</span>
                      <!-- <span
                      v-for="genre in podcast.genre_ids.slice(0, 1)"
                      :key="genre"
                      >{{$store.getters.getGenreTitleById(genre).name}}</span>-->
                    </span>
                    <span class="languagePodcast">{{podcast.language}}</span>
                  </div>
                </div>
              </el-card>
            </el-col>
          </el-row>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.cardPodcast {
  margin: 10px;
}

.cardPodcast {
  width: 300px;
  height: 375px;
}

.imagePodcast {
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);
}

.el-card__body {
  padding: 0px;
  height: 100%;
}

.infoBoxPodcast {
  padding: 14px;
  height: 64px;
}

.titlePodcast {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 1.2rem;
  height: 1.3rem;
}

.languagePodcast {
  position: relative;
  float: right;
  top: 12px;
}

.genrePodcast {
  position: relative;
  top: 12px;
}
</style>


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
        genres: "",
        mostPopular: [],
        randomGenre: {
          genre: {},
          podcasts: {}
        }
      }
    };
  },
  created() {
    console.log(this.$store.getters.getRandomGenre);

    // console.log(this.$store.getters.getGenreTitleById(67));
    // Get user info
    this.$store.dispatch("getUserInfo").then(userInfo => {
      this.userInfo.username = userInfo.username;
      this.userInfo.email = userInfo.email;
    });
    if (this.$store.getters.getMostPopularPodcasts[0]) {
      console.log(this.$store.getters.getMostPopularPodcasts[0].podcasts);

      this.podcasts.mostPopular = this.$store.getters.getMostPopularPodcasts[0].podcasts;
    } else {
      // Fetch most popular Podcasts
      axios
        .get("https://listen-api.listennotes.com/api/v2/best_podcasts", {
          headers: { "X-ListenAPI-Key": "2e2c4f39b7b44659b73cb3b31f95236e" }
        })
        .then(res => {
          console.log("Fetched most popular podcasts from API.");
          this.$store.commit("addMostPopularPodcasts", res.data);
          this.podcasts.mostPopular = res.data.podcasts;
          console.log(this.podcasts.mostPopular);
        })
        .catch(err => {
          console.log(err);
        });
      console.log("Most popular podcasts already fetched and in VUEX state.");
    }

    if (this.$store.getters.getGenres[0]) {
      // console.log(this.$store.getters.getGenres);

      this.podcasts.genres = this.$store.getters.getGenres;
    } else {
      // Fetch genres only if not in VUEX store
      axios
        .get("https://listen-api.listennotes.com/api/v2/genres", {
          headers: { "X-ListenAPI-Key": "2e2c4f39b7b44659b73cb3b31f95236e" }
        })
        .then(res => {
          console.log("Fetched genres from API.");
          this.$store.commit("addGenres", res.data);
          this.podcasts.genres = res.data;
        })
        .catch(err => {
          console.log(err);
        });
    }

    // Get a random genre and associated podcasts
    this.podcasts.randomGenre.genre = this.$store.getters.getRandomGenre;
    axios
      .get(
        `https://listen-api.listennotes.com/api/v2/best_podcasts?genre_id=${
          this.podcasts.randomGenre.genre.id
        }`,
        {
          headers: { "X-ListenAPI-Key": "2e2c4f39b7b44659b73cb3b31f95236e" }
        }
      )
      .then(res => {
        console.log(res.data);
        this.podcasts.randomGenre.podcasts = res.data.podcasts.slice(0, 8);
        console.log(this.podcasts.randomGenre.podcasts.slice(0, 8));
      })
      .catch(err => {
        console.log(err);
      });
  },
  methods: {
    getGenreTitleById(id) {
      return this.$store.getters.getGenreTitleById(id);
    }
  }
};
</script>
