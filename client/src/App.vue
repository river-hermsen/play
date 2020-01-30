<template>
  <div id="app">
    <div id="toolbar">
      <div id="drag-region">
        <div id="window-title">
          <span @click="test()">PLAY PROJECT</span>
        </div>
        <div id="window-controls">
          <div class="button" id="min-button" @click="minimizeWindow()">
            <span>&#xE921;</span>
          </div>
          <div class="button" id="max-button" @click="maximizeWindow()" v-if="!isMaximized">
            <span>&#xE922;</span>
          </div>
          <div class="button" id="restore-button" @click="unMaximizeWindow()" v-if="isMaximized">
            <span>&#xE923;</span>
          </div>
          <div class="button" id="close-button" @click="closeWindow()">
            <span>&#xE8BB;</span>
          </div>
        </div>
      </div>
    </div>
    <div id="nav">
      <el-menu>
        <div class="router-control-container">
          <div class="router-control-back" @click="routerGoBack()">
            <i class="el-icon-back"></i>
          </div>
          <div class="router-control-forward" @click="routerGoForward()">
            <i class="el-icon-right"></i>
          </div>
        </div>

        <router-link to="/search" tag="el-menu-item">
          <!-- <el-menu-item index="/search"> -->
          <i class="el-icon-search"></i>
          <span>Search</span>
          <!-- </el-menu-item> -->
        </router-link>
        <router-link to="/home" tag="el-menu-item">
          <!-- <el-menu-item index="/home"> -->
          <i class="el-icon-s-home"></i>
          <span>Home</span>
          <!-- </el-menu-item> -->
        </router-link>
        <router-link to="/browse" tag="el-menu-item">
          <!-- <el-menu-item index="/browse"> -->
          <i class="el-icon-files"></i>
          <span>Browse</span>
          <!-- </el-menu-item> -->
        </router-link>
        <router-link to="/continue" tag="el-menu-item">
          <!-- <el-menu-item index="/browse"> -->
          <i class="el-icon-d-arrow-right"></i>
          <span>Continue listening</span>
          <!-- </el-menu-item> -->
        </router-link>

        <!-- <router-link to="/search" exact tag="el-menu-item"> -->
        <el-menu-item index="randomPodcast" @click="randomPodcast()">
          <i class="el-icon-position"></i>
          <span>Random podcast</span>
        </el-menu-item>
        <!-- </router-link> -->
      </el-menu>
    </div>
    <div id="player">
      <Player />
    </div>
    <div id="content">
      <keep-alive :exclude="['Podcast', 'Genre', 'Region', 'Language']" :max="5">
        <router-view />
      </keep-alive>
    </div>
  </div>
</template>

<style lang="scss">
@import url("https://fonts.googleapis.com/css?family=Open+Sans&display=swap");

// Fixed bug of not detecting end of page scroll
html,
body {
  width: unset !important;
  height: unset !important;
}

body {
  font-family: "Open Sans", sans-serif !important;
  margin: unset;
}

#nav {
  .el-menu {
    width: 220px !important;
    padding-top: 30px;
    min-height: calc(100vh - 110px);
    position: fixed;
    .router-control-container {
      padding: 1rem 5.1rem 1rem 5.1rem;
      margin: 0 auto;
      font-size: 1.5rem;
      .router-control-back {
        cursor: pointer;
        display: inline;
        padding-right: 0.3rem;
        border-right: 1px solid #ebebeb;
      }
      .router-control-forward {
        cursor: pointer;
        display: inline;
        float: right;
      }
      .router-control-impossible {
        color: #d4d4d4;
        cursor: unset;
      }
    }
  }
}

#toolbar {
  display: block;
  position: fixed;
  height: 32px;
  width: 100%; /*Compensate for body 1px border*/
  background: #f0f0f0;
  z-index: 999;
  #window-controls {
    -webkit-app-region: no-drag;
    display: grid;
    grid-template-columns: repeat(3, 46px);
    position: absolute;
    top: 0;
    right: 0;
    height: 100%;
    font-family: "Segoe MDL2 Assets";
    font-size: 10px;
  }

  #window-controls .button {
    user-select: none;
    cursor: default;
    grid-row: 1 / span 1;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
  }
  #window-controls #min-button {
    grid-column: 1;
  }
  #window-controls #max-button,
  #window-controls #restore-button {
    grid-column: 2;
  }
  #window-controls #close-button {
    grid-column: 3;
  }
  #drag-region {
    width: 100%;
    height: 100%;
    -webkit-app-region: drag;
  }
  #window-controls .button:hover {
    background: #d4d4d4;
  }
  #window-controls .button:active {
    background: #d4d4d4;
  }

  #close-button:hover {
    background: #e81123 !important;
    color: #ffffff;
  }
  #close-button:active {
    background: #f1707a !important;
  }
  #titlebar #drag-region {
    display: grid;
    grid-template-columns: auto 138px;
  }

  #window-title {
    height: 100%;
    grid-column: 1;
    display: flex;
    align-items: center;
    margin-left: 8px;
    overflow-x: hidden;
    font-family: "Segoe UI", sans-serif;
    font-size: 12px;
  }

  #window-title span {
    overflow: hidden;
    text-overflow: ellipsis;
    line-height: 1.5;
  }
}

#player {
  position: fixed;
  bottom: 0px;
  height: 110px;
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
  padding-top: 52px;
}
.el-slider__button {
  width: 12px;
  height: 12px;
}
.el-menu-item {
  color: #8f9ab3;
}
.el-menu-item.router-link-active {
  border-left: 4px solid #000000;
}
.el-menu-item.is-active {
  color: #8f9ab3;
}
.el-menu-item.router-link-active {
  color: #000000;
}
.el-menu-item i {
  color: unset;
}
.el-loading-spinner {
  margin-top: 34vh;
}

.el-notification.right {
  bottom: 130px !important;
}
</style>
<style lang="scss">
@import "@/assets/scss/loading.scss";
</style>

<script>
/* eslint-disable no-unused-vars */
/* eslint-disable no-shadow */

import axios from 'axios';
import { createBrowserHistory, createMemoryHistory } from 'history';

import Player from './components/Player.vue';
import globalMixin from './sevices/_helper';

// eslint-disable-next-line import/no-extraneous-dependencies
const { remote } = require('electron');

const history = createBrowserHistory();
const history2 = createMemoryHistory();

// Get the current location.
const { location } = history;

// Listen for changes to the current location.
const unlisten = history.listen((location, action) => {
  // location is an object like window.location
  console.log(action, location.pathname, location.state);
});

unlisten();
export default {
  name: 'App',
  components: {
    Player,
  },
  data() {
    return {
      isMaximized: null,
    };
  },
  mixins: [globalMixin],
  methods: {
    closeWindow() {
      this.currentWindow.close();
    },
    maximizeWindow() {
      this.currentWindow.maximize();
    },
    unMaximizeWindow() {
      this.currentWindow.unmaximize();
    },
    minimizeWindow() {
      this.currentWindow.minimize();
    },
    routerGoBack() {
      this.$router.go(-1);
    },
    routerGoForward() {
      this.$router.go(1);
    },
    randomPodcast() {
      axios
        .get('https://listen-api.listennotes.com/api/v2/just_listen', {
          headers: { 'X-ListenAPI-Key': '2e2c4f39b7b44659b73cb3b31f95236e' },
        })
        .then((response) => {
          const podcastId = response.data.podcast_id;
          this.$router.push(`/podcast/${podcastId}`);
        })
        .catch(() => {
          globalMixin.methods.somethingWentWrongNotification(this);
        });
    },
  },
  computed: {
    currentWindow() {
      return remote.getCurrentWindow();
    },
    isRemoteMaximized() {
      return remote.getCurrentWindow().isMaximized();
    },
  },
  watch: {
    isReallMax() {
      console.log('changed');
    },
  },
  mounted() {
    // history.listen((location, action) => {
    //   console.log(
    //     `The current URL is ${location.pathname}${location.search}${location.hash}`,
    //   );
    //   console.log(`The last navigation action was ${action}`);
    // });

    remote.getCurrentWindow().on('maximize', () => {
      this.isMaximized = true;
    });
    remote.getCurrentWindow().on('unmaximize', () => {
      this.isMaximized = false;
    });
  },
};
</script>
