<template>
  <div id="app">
    <div id="nav">
      <div v-if="!isLoggedIn">
        <el-menu class="el-menu-demo" mode="horizontal" router>
          <el-row type="flex" justify="end">
            <el-col :span="2" class="logo-menu-col">
              <el-menu-item index="/">Play</el-menu-item>
            </el-col>
            <el-col :span="2" v-if="!isLoggedIn">
              <el-menu-item index="/login" class="loggedOutMenuItem">Login</el-menu-item>
            </el-col>
            <el-col :span="2" v-if="!isLoggedIn">
              <el-menu-item index="/signup" class="loggedOutMenuItem">Sign Up</el-menu-item>
            </el-col>
          </el-row>
        </el-menu>
      </div>
      <div v-if="isLoggedIn">
        <el-menu default-active="2" class="loggedInMenu" router collapse>
          <el-menu-item index="/search">
            <i class="el-icon-search"></i>
            <span>Search</span>
          </el-menu-item>
          <el-menu-item index="/browse">
            <i class="el-icon-goods"></i>
            <span>Browse</span>
          </el-menu-item>
          <el-menu-item @click="logOut" class="loggedInMenuItemBottom">
            <i class="el-icon-circle-close"></i>
            <span>Sign Out</span>
          </el-menu-item>
        </el-menu>
      </div>
    </div>
    <div class="content" v-bind:class="{ loggedInContent: isLoggedIn }">
      <router-view/>
    </div>
    <Player v-if="isLoggedIn"/>
  </div>
</template>

<script>
import Player from "@/components/Player.vue";
export default {
  data() {
    return {
      isLoggedIn: this.$store.state.isLoggedIn
    };
  },
  components: {
    Player
  },
  methods: {
    logOut() {
      this.$store.dispatch("logOutUser").then(() => {
        this.$router.go("/login");
      });
    }
  }
};
</script>

<style lang="scss">
@import url("https://fonts.googleapis.com/css?family=Poppins");
body {
  font-family: "Poppins", sans-serif;
}
#app {
  font-family: "Poppins", sans-serif;
  background-color: #f5f5f5;
  height: 100vh;
}

.loggedInContent {
  padding: 20px 20px 20px 100px;
}
</style>

<style lang="scss" scoped>
.loggedOutMenuItem {
  text-align: center;
}
.loggedInMenuItemBottom {
  position: absolute;
  bottom: 0px;
}

.loggedInMenu {
  position: fixed;
  float: left;
  height: 88vh;
}

.logo-menu-col {
  margin-right: auto;
}

#player {
  background-color: #ffffff;
  position: fixed;
  bottom: 0px;
  width: 100vw;
  height: 12vh;
  display: flex;
  #playerImg {
    padding: 0.5vh;
    img {
      width: 10vh;
    }
  }
  #playerInfo {
    h3 {
      display: inline;
    }
  }
}

.content {
  max-width: 1500px;
  margin: 0 auto;
  margin-bottom: 12vh;
}
</style>

