<template>
  <div id="regionContent">
    <div class="header-container">
      <h3>Regions:</h3>
    </div>
    <div class="search-container">
      <el-input placeholder="Search for genres" v-model="regionSearchQuery"></el-input>
    </div>
    <div class="region-container">
      <el-row :gutter="12">
        <!-- <el-col
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
        </el-col>-->
      </el-row>
      <div v-if="noResultsFound">
        <h2>No genres found</h2>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
#regionContent {
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
  .region-container {
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
import axios from 'axios';

export default {
  data() {
    return {
      regions: [],
      searchRegions: [],
      noResultsFound: false,
      regionSearchQuery: '',
    };
  },
  methods: {
    searchRegion() {
      this.noResultsFound = false;
      const { genres } = this;
      const searchedRegions = [];

      for (let i = 0; i < genres.length; i += 1) {
        const searchRegion = genres[i]
          .toLowerCase()
          .search(this.regionSearchQuery.toLowerCase());
        if (searchRegion > -1) {
          searchedRegions.push(genres[i]);
        }
      }

      if (searchedRegions.length === 0) {
        this.noResultsFound = true;
      }
      this.searchRegions = searchedRegions;
    },
  },
  watch: {
    genreSearchQuery(newSearch) {
      if (newSearch) {
        this.searchGenre();
      } else {
        this.searchGenres = [];
      }
    },
  },
  created() {
    console.log('creating');
    axios
      .get('https://listen-api.listennotes.com/api/v2/regions', {
        headers: { 'X-ListenAPI-Key': '2e2c4f39b7b44659b73cb3b31f95236e' },
      })
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.log(error);
      });

    // const genres = storeGenres.map((genre) => genre.name);
    // genres.sort();
    // const uniqueGenres = [...new Set(genres)];
    // this.genres = uniqueGenres;
  },
};
</script>
