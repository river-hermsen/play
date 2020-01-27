<template>
  <div id="browse">
    <div class="header-container">
      <h1>Browse</h1>
    </div>
    <div id="contentBrowse">
      <el-tabs v-model="activeTabName">
        <el-tab-pane label="Genres" name="Genres">
          <All type="Genres" />

          <!-- <GenreContent /> -->
        </el-tab-pane>
        <el-tab-pane label="Regions" name="Regions">
          <All type="Regions" />

          <!-- <RegionContent /> -->
        </el-tab-pane>
        <el-tab-pane label="Languages" name="Languages">
          <All type="Languages" />
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<style lang="scss" scoped>
#browse {
  .header-container {
    margin-top: 0.5rem;
    h1 {
      font-size: 2.3rem;
    }
  }
  #contentBrowse {
    margin-top: 1.5rem;
  }
}
</style>

<script>
// import GenreContent from '../components/browse/Genres.vue';
// import RegionContent from '../components/browse/Regions.vue';
import All from '../components/ChildBrowse.vue';

export default {
  name: 'Browse',
  components: { All },
  data() {
    return {
      activeTabName: 'Genres',
    };
  },
};
</script>
