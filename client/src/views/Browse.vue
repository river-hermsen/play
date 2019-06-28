<template>
  <div>
    <div class="header">
      <h1>Hi {{this.userInfo.username}}</h1>
    </div>
    <el-divider></el-divider>
    <div v-loading="podcasts.isLoading" v-if="podcasts.isLoading" class="loadingIconBrowse"></div>
    <div class="content" v-if="!podcasts.isLoading">
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
              <router-link
                :to="{ name: 'Podcast', params: { id: podcast.id }}"
                class="routerPodcastLink"
                @click.native="$scrollToTop"
              >
                <div class="containerImagePodcast">
                  <img :src="podcast.thumbnail" class="imagePodcast">
                </div>
                <div class="infoBoxPodcast">
                  <div class="titlePodcast">
                    <b :title="podcast.title">{{podcast.title}}</b>
                  </div>
                  <div>
                    <span>
                      <span
                        class="genrePodcast"
                      >{{$store.getters.getGenreTitleById(podcast.genre_ids, podcasts.genres).name}}</span>
                    </span>
                    <span class="languagePodcast">{{podcast.language}}</span>
                  </div>
                </div>
              </router-link>
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
                <router-link
                  :to="{ name: 'Podcast', params: { id: podcast.id }}"
                  class="routerPodcastLink"
                  @click.native="$scrollToTop"
                >
                  <div class="containerImagePodcast">
                    <img :src="podcast.thumbnail" class="imagePodcast">
                  </div>
                  <div class="infoBoxPodcast">
                    <div class="titlePodcast">
                      <b :title="podcast.title">{{podcast.title}}</b>
                    </div>
                    <div>
                      <span>
                        <span
                          class="genrePodcast"
                        >{{$store.getters.getGenreTitleById(podcast.genre_ids, podcasts.genres).name}}</span>
                      </span>
                      <span class="languagePodcast">{{podcast.language}}</span>
                    </div>
                  </div>
                </router-link>
              </el-card>
            </el-col>
          </el-row>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.loadingIconBrowse {
  padding-top: 200px;
}

.el-loading-mask {
  background-color: transparent;
}

.el-loading-spinner .circular {
  width: 100px;
  height: 100px;
}

.cardPodcast {
  margin: 10px;
}

.cardPodcast {
  width: 300px;
  height: 375px;
}

.routerPodcastLink {
  color: black;
  text-decoration: none;
}
.containerImagePodcast {
  width: 300px;
  height: 300px;
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
import Cookies from "js-cookie";
export default {
  data() {
    return {
      userInfo: {
        username: "",
        email: ""
      },
      podcasts: {
        isTrue: true,
        isFalse: false,
        isLoading: true,
        genres: [],
        mostPopular: [],
        randomGenre: {
          genre: {},
          podcasts: {}
        }
      }
    };
  },
  created() {
    // console.log(this.$store.getters.getGenreTitleById(podcasts.mostPopular[0].genre).name);

    // Get user info
    if (Cookies.get("user")) {
      const userInfo = JSON.parse(Cookies.get("user"));
      this.userInfo.username = userInfo.username;
      this.userInfo.email = userInfo.email;
    }

    if (localStorage.getItem("mostPopularPodcasts")) {
      console.log("Most popular podcasts already fetched and in LocalStorage.");
      this.podcasts.mostPopular = JSON.parse(
        localStorage.getItem("mostPopularPodcasts")
      );
    } else {
      // Fetch most popular Podcasts
      axios
        .get("https://listen-api.listennotes.com/api/v2/best_podcasts", {
          headers: { "X-ListenAPI-Key": "2e2c4f39b7b44659b73cb3b31f95236e" }
        })
        .then(res => {
          console.log("Fetched most popular podcasts from API.");
          localStorage.setItem(
            "mostPopularPodcasts",
            JSON.stringify(res.data.podcasts)
          );
          // this.$store.commit("addMostPopularPodcasts", res.data);
          this.podcasts.mostPopular = res.data.podcasts;
          console.log(this.podcasts.mostPopular);
        })
        .catch(err => {
          console.log(err);
        });
    }

    const VueInstance = this;
    new Promise(function(resolve, reject) {
      if (localStorage.getItem("podcastGenres")) {
        console.log("Podcats genres already fetched and in LocalStorage.");
        VueInstance.podcasts.genres = JSON.parse(
          localStorage.getItem("podcastGenres")
        );
        resolve();
      } else {
        // Fetch genres only if not in VUEX store
        axios
          .get("https://listen-api.listennotes.com/api/v2/genres", {
            headers: { "X-ListenAPI-Key": "2e2c4f39b7b44659b73cb3b31f95236e" }
          })
          .then(res => {
            console.log("Fetched genres from API.");
            // this.$store.commit("addGenres", res.data);
            localStorage.setItem(
              "podcastGenres",
              JSON.stringify(res.data.genres)
            );
            VueInstance.podcasts.genres = res.data.genres;
            resolve();
          })
          .catch(err => {
            console.log(err);
            reject();
          });
      }
    }).then(() => {
      var randomGenre =
        VueInstance.podcasts.genres[
          Math.floor(Math.random() * VueInstance.podcasts.genres.length)
        ];

      console.log(randomGenre);

      axios
        .get(
          `https://listen-api.listennotes.com/api/v2/best_podcasts?genre_id=${
            randomGenre.id
          }`,
          {
            headers: { "X-ListenAPI-Key": "2e2c4f39b7b44659b73cb3b31f95236e" }
          }
        )
        .then(res => {
          VueInstance.podcasts.randomGenre.podcasts = res.data.podcasts.slice(
            0,
            8
          );
          VueInstance.podcasts.randomGenre.genre = randomGenre;
          VueInstance.podcasts.isLoading = false;
        })
        .catch(err => {
          console.log(err);
        });
    });

    // // Get a random genre and associated podcasts
    // this.podcasts.randomGenre.genre = this.$store.getters.getRandomGenre;
    // const randomGenre = this.podcasts.genres[
    //   Math.floor(Math.random() * genres.length)
    // ];

    // axios
    //   .get(
    //     `https://listen-api.listennotes.com/api/v2/best_podcasts?genre_id=${randomGenre}`,
    //     {
    //       headers: { "X-ListenAPI-Key": "2e2c4f39b7b44659b73cb3b31f95236e" }
    //     }
    //   )
    //   .then(res => {
    //     console.log(res.data);
    //     this.podcasts.randomGenre.podcasts = res.data.podcasts.slice(0, 8);
    //     console.log(this.podcasts.randomGenre.podcasts.slice(0, 8));
    //   })
    //   .catch(err => {
    //     console.log(err);
    //   });
  },
  methods: {
    getGenreTitleById(id) {
      return this.$store.getters.getGenreTitleById(id);
    }
  }
};
</script>
