<template>
  <div>
    <div class="content">
      <el-input placeholder="Search" v-model="searchInput" class="searchInput"></el-input>
    </div>
  </div>
</template>

<style>
.searchInput {
  font-size: 2rem;
}

.el-input__inner {
  height: 90px;
}
</style>

<script>
export default {
  data() {
    return {
      searchInput: ""
    };
  }
};
</script>
