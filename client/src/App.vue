<template>
  <div id="app">
    <div id="nav">
      <el-menu class="el-menu-demo" mode="horizontal" router>
        <el-row>
          <el-col :span="2">
            <el-menu-item index="/">Play</el-menu-item>
          </el-col>
          <el-col :span="2" :offset="18">
            <el-menu-item index="/login">Login</el-menu-item>
          </el-col>
          <el-col :span="2">
            <el-menu-item index="/signup">Sign Up</el-menu-item>
          </el-col>
        </el-row>
      </el-menu>
    </div>
    <div class="content">
      <router-view/>
    </div>
  </div>
</template>

<style lang="scss">
@import url("https://fonts.googleapis.com/css?family=Poppins");

#app {
  font-family: "Poppins", sans-serif;
}
</style>

<style lang="scss" scoped>
.el-menu-item {
  text-align: center;
}

.content {
  height: calc(100vh - 58px);
  background-color: #f5f5f5;
}
</style>

