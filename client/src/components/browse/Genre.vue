<template>
  <div id="genreContent">
    <div class="header-container">
      <h3>Genres:</h3>
    </div>
    <div class="search-container">
      <el-input placeholder="Search for genres" v-model="genreSearchQuery"></el-input>
    </div>
    <div class="genres-container">
      <el-row :gutter="12" v-if="!noResultsFound">
        <el-col
          :span="6"
          class="card"
          v-for="genre in searchGenres.length === 0 ? genres : searchGenres"
          :key="genre"
        >
          <router-link :to="'/genre/' + genre" class="genre-link">
            <el-card>
              <div class="card-content-container">
                <p>{{genre}}</p>
              </div>
            </el-card>
          </router-link>
        </el-col>
      </el-row>
      <div v-if="noResultsFound">
        <h2>No genres found</h2>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
#genreContent {
  .header-container {
    border-bottom: 1px solid #ebebeb;
    padding-bottom: 0.5rem;
    h3 {
      color: #000;
    }
  }
  .search-container {
    padding-top: 1rem;
    padding-bottom: 1rem;
  }
  .genres-container {
    margin: 0.5rem;
    .card {
      cursor: pointer;
      margin-top: 1rem;
      .genre-link {
        color: inherit;
        text-decoration: none;
      }
      .card-content-container {
        padding: 8px;
        text-align: center;
      }
    }
    .card:hover {
      p {
        text-decoration: underline;
      }
    }
  }
}
</style>

<script>
export default {
  data () {
    return {
      genres: [],
      searchGenres: [],
      noResultsFound: false,
      genreSearchQuery: ''
    };
  },
  methods: {
    searchGenre () {
      this.noResultsFound = false;
      var genres = this.genres;
      var searchedGenres = [];

      for (let i = 0; i < genres.length; i++) {
        let searchGenre = genres[i]
          .toLowerCase()
          .search(this.genreSearchQuery.toLowerCase());
        if (searchGenre > -1) {
          searchedGenres.push(genres[i]);
        }
      }

      if (searchedGenres.length === 0) {
        this.noResultsFound = true;
      }
      this.searchGenres = searchedGenres;
    }
  },
  watch: {
    genreSearchQuery (newSearch) {
      if (newSearch) {
        this.searchGenre();
      } else {
        this.searchGenres = [];
      }
    }
  },
  created () {
    let storeGenres = this.$store.getters.getGenres;

    let genres = storeGenres.map(genre => {
      return genre.name;
    });
    genres.sort();
    let uniqueGenres = [...new Set(genres)];
    this.genres = uniqueGenres;
  }
};
</script>
