<template>
  <div id="browse">
    <div class="header-container">
      <h1>Browse</h1>
    </div>
    <div id="contentBrowse">
      <el-tabs v-model="activeTabName">
        <el-tab-pane label="Genres" name="Genres">
          <GenreContent />
        </el-tab-pane>
        <el-tab-pane label="Regions" name="Regions">Regions</el-tab-pane>
        <el-tab-pane label="Languages" name="Languages">Languages</el-tab-pane>
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
import GenreContent from '../components/browse/Genre';

export default {
  name: 'Browse',
  components: { GenreContent },
  data () {
    return {
      activeTabName: 'Genres'
    };
  }
};
</script>
