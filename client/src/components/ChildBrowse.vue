<template>
  <div id="browseChildContent">
    <div class="header-container">
      <h3>{{type}}:</h3>
    </div>
    <div class="search-container">
      <!-- eslint-disable-next-line max-len -->
      <el-input :placeholder="'Search for ' + type.toLowerCase()" v-model="dataSearchQuery"></el-input>
    </div>
    <div class="child-container">
      <el-row :gutter="12" v-if="!noResultsFound">
        <el-col
          :span="6"
          class="card"
          v-for="data in searchData.length === 0 ? data : searchData"
          :key="data"
        >
          <router-link
            :to="'/' + type.toLowerCase().slice(0, -1) + '/' + data"
            class="genre-link"
            v-if="type === 'Genres' || type === 'Languages'"
          >
            <el-card>
              <div class="card-content-container">
                <p>{{data}}</p>
              </div>
            </el-card>
          </router-link>
          <router-link
            :to="'/' + type.toLowerCase().slice(0, -1)
            + '/' + data
            + '?code=' + Object.keys(regionCodes).find(key =>
              regionCodes[key] === data)"
            class="genre-link"
            v-else-if="type === 'Regions'"
          >
            <el-card>
              <div class="card-content-container">
                <p>{{data}}</p>
              </div>
            </el-card>
          </router-link>
        </el-col>
      </el-row>
      <div v-if="noResultsFound">
        <h2>No {{type.toLowerCase()}} found</h2>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
#browseChildContent {
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
  .child-container {
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
  props: {
    type: {
      validator(value) {
        // The value must match one of these strings
        return ['Genres', 'Regions', 'Languages'].indexOf(value) !== -1;
      },
    },
  },
  data() {
    return {
      data: [],
      searchData: [],
      noResultsFound: false,
      dataSearchQuery: '',
    };
  },
  methods: {
    searchForData() {
      this.noResultsFound = false;
      const { data } = this;
      const searchedData = [];

      for (let i = 0; i < data.length; i += 1) {
        const searchData = data[i]
          .toLowerCase()
          .search(this.dataSearchQuery.toLowerCase());
        if (searchData > -1) {
          searchedData.push(data[i]);
        }
      }

      if (searchedData.length === 0) {
        this.noResultsFound = true;
      }
      this.searchData = searchedData;
    },
  },
  watch: {
    dataSearchQuery(newSearch) {
      if (newSearch) {
        this.searchForData();
      } else {
        this.searchData = [];
      }
    },
  },
  mounted() {
    if (this.type === 'Genres') {
      const storeGenres = this.$store.getters.getGenres;
      const genres = storeGenres.map((genre) => genre.name);
      genres.sort();
      const uniqueGenres = [...new Set(genres)];
      this.data = uniqueGenres;
    } else if (this.type === 'Regions') {
      axios
        .get('https://listen-api.listennotes.com/api/v2/regions', {
          headers: { 'X-ListenAPI-Key': '2e2c4f39b7b44659b73cb3b31f95236e' },
        })
        .then((response) => {
          console.log(response);
          this.regionCodes = response.data.regions;
          this.data = Object.values(response.data.regions).sort();
        })
        .catch((error) => {
          console.log(error);
        });
    } else if (this.type === 'Languages') {
      axios
        .get('https://listen-api.listennotes.com/api/v2/languages', {
          headers: { 'X-ListenAPI-Key': '2e2c4f39b7b44659b73cb3b31f95236e' },
        })
        .then((response) => {
          console.log(response);
          this.data = response.data.languages.sort();
        })
        .catch((error) => {
          console.log(error);
        });
    }
  },
};
</script>
