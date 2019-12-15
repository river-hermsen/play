<template>
  <div id="app">
    <div id="toolbar">
      <div id="drag-region">
        <div id="window-title">
          <span>PLAY PROJECT</span>
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
      <at-menu mode="inline" router>
        <at-menu-item name="search" to="/search">
          <i class="icon icon-search"></i>Search
        </at-menu-item>
        <at-menu-item name="home" to="/home">
          <i class="icon icon-home"></i>Home
        </at-menu-item>
        <at-menu-item name="browse" to="/browse">
          <i class="icon icon-layers"></i>Browse
        </at-menu-item>
        <!-- <at-menu-item name="randomEpisode" @click="test()">
          <i class="icon icon-shuffle"></i>Play random episode
        </at-menu-item>-->
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

// Fixed bug of not detecting end of page scroll
html,
body {
  width: unset !important;
  height: unset !important;
}

body {
  font-family: "Open Sans", sans-serif !important;
}

#nav {
  .at-menu {
    width: 220px !important;
    padding-top: 30px;
    min-height: calc(100vh - 110px);
    position: fixed;
    #signOut {
      position: absolute;
      bottom: 12px;
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
  }
  #close-button:active {
    background: #f1707a !important;
    color: #000;
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
  padding-top: 52px;
}

//Fixed loading bar
.at-loading-bar {
  top: 32px !important;
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
<style lang="scss">
@import "@/assets/scss/loading.scss";
</style>
<script>
import Player from './components/Player';
import { globalMixin } from './sevices/_helper';
const remote = require('electron').remote;

export default {
  name: 'App',
  components: {
    Player
  },
  data () {
    return {
      isMaximized: false
    };
  },
  mixins: [globalMixin],
  methods: {
    closeWindow () {
      this.currentWindow.close();
    },
    maximizeWindow () {
      this.isMaximized = true;
      this.currentWindow.maximize();
    },
    unMaximizeWindow () {
      this.isMaximized = false;
      this.currentWindow.unmaximize();
    },
    minimizeWindow () {
      this.currentWindow.minimize();
    }
  },
  computed: {
    currentWindow () {
      return remote.getCurrentWindow();
    }
  }
};
</script>
