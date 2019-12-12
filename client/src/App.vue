<template>
  <div id="app">
    <div id="toolbar"></div>
    <div id="nav">
      <at-menu mode="inline" router>
        <at-menu-item name="search" to="/search">
          <i class="icon icon-search"></i>Search
        </at-menu-item>
        <at-menu-item name="browse" to="/browse">
          <i class="icon icon-layers"></i>Browse
        </at-menu-item>
        <!-- <at-menu-item name="logOut" id="signOut">
          <i class="icon icon-log-out"></i>Sign Out
        </at-menu-item>-->
      </at-menu>
    </div>
    <div id="player">
      <Player />
    </div>
    <div id="content">
      <keep-alive exclude="Podcast" :max="5">
        <router-view />
      </keep-alive>
    </div>
  </div>
</template>

<style lang="scss">
@import url("https://fonts.googleapis.com/css?family=Open+Sans&display=swap");

body {
  font-family: "Open Sans", sans-serif !important;
}

#nav {
  .at-menu {
    width: 220px !important;
    padding-top: 6px;
    min-height: calc(100vh - 110px);
    position: fixed;
    #signOut {
      position: absolute;
      bottom: 12px;
    }
  }
}

#player {
  position: fixed;
  bottom: 0px;
  height: 100px;
  z-index: 99;
  background-color: #fff;
  width: 100%;
  border-top: 1px solid #ebebeb;
}

#content {
  padding-left: 240px;
  padding-right: 20px;
  padding-bottom: 140px;
  margin: 0 auto;
  max-width: 1150px;
  padding-top: 20px;
}

// Fixed slider bug
.at-tooltip__trigger {
  display: block !important;
  top: 2px;
}
// Remove tooltip from slider
.at-tooltip__popper {
  display: none;
}

.at-input__icon {
  font-size: 2.5rem !important;
  display: flex !important;
  align-items: center !important;
  margin-right: 2rem !important;
}
</style>

<script>
/* eslint-disable semi */
import Player from './components/Player';

export default {
  name: 'App',
  components: {
    Player
  }
};
</script>
