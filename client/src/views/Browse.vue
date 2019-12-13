<template>
  <div id="browse">
    <div class="header-container">
      <h1>Browse</h1>
    </div>
    <div id="contentBrowse">
      <at-tabs>
        <at-tab-pane label="Genres" name="Genres" icon="icon-book">
          <GenreContent />
        </at-tab-pane>
        <at-tab-pane label="Regions" name="Regions" icon="icon-map">
          <p>Content of Tab Pane 2</p>
        </at-tab-pane>
        <at-tab-pane label="Languages" name="Languages" icon="icon-globe">
          <p>Content of Tab Pane 3</p>
        </at-tab-pane>
      </at-tabs>
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
  components: { GenreContent }
};
</script>
