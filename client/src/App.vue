<template>
  <div id="app">
    <div id="nav">
      <at-menu mode="inline" active-name="browse">
        <at-menu-item name="search" to="/search">
          <i class="icon icon-search"></i>Search
        </at-menu-item>
        <at-menu-item name="browse" to="/browse">
          <i class="icon icon-layers"></i>Browse
        </at-menu-item>
        <at-menu-item name="logOut" id="signOut">
          <i class="icon icon-log-out"></i>Sign Out
        </at-menu-item>
      </at-menu>
    </div>
    <div id="content">
      <router-view />
    </div>
  </div>
</template>

<style lang="scss">
@import url("https://fonts.googleapis.com/css?family=Open+Sans&display=swap");

body {
  font-family: "Open Sans", sans-serif !important;
}

#nav {
  min-height: 100%;
  .at-menu {
    width: 220px !important;
    padding-top: 6px;
    min-height: 100vh;
    position: fixed;
    #signOut {
      position: absolute;
      bottom: 12px;
    }
  }
}

#content {
  margin-left: 220px;
  margin-top: 6px;
  padding-left: 10px;
  max-width: 1050px;
  margin: 0 auto;
}
</style>
