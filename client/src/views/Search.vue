<template>
  <div id="search">
    <div class="header">
      <!-- <h1>Search</h1> -->
      <at-input
        v-model="searchQuery"
        class="search-input"
        placeholder="Search podcasts, episodes or genres"
      ></at-input>
    </div>
  </div>
</template>

<style lang="scss">
#search {
  .header {
    h1 {
      font-size: 2rem;
    }
    .search-input {
      line-height: 2;
      input {
        font-size: 2rem;
      }
    }
  }
}
</style>

<script>
/* eslint-disable semi */
import axios from 'axios';
import { globalMixin } from '../sevices/_helper';
export default {
  data () {
    return {
      searchQuery: null
    };
  },
  mixins: [globalMixin],
  created: function () {
    this.debouncedGetAnswer = globalMixin.methods._debounce(
      this.searchForQuery,
      500
    );
  },
  methods: {
    searchForQuery () {
      axios
        .get(
          `https://listen-api.listennotes.com/api/v2/podcasts/${this.podcastId}`,
          {
            headers: { 'X-ListenAPI-Key': '2e2c4f39b7b44659b73cb3b31f95236e' }
          }
        )
        .then(response => {
          console.log(response.data);

          this.podcastInfo = response.data;
        })
        .catch(function (error) {
          console.log(error);
        });
    }
  },
  watch: {
    searchQuery (newQuery) {
      console.log('changed');
      if (newQuery !== '' || null) {
        this.debouncedGetAnswer();
      }
    }
  }
};
</script>
