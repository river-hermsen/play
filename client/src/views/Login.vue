<template>
  <div>
    <at-menu theme="dark" mode="horizontal" active-name="0">
      <at-menu-item name="home" to="/home">
        <i class="icon icon-play-circle"></i>PLAY
      </at-menu-item>
      <at-menu-item name="login" to="/login">
        <i class="icon icon-log-in"></i>Login
      </at-menu-item>
    </at-menu>

    <div id="login">
      <h1>Login</h1>
      <at-input v-model="email" placeholder="Email" size="large"></at-input>
      <at-input v-model="password" placeholder="Password" size="large"></at-input>
      <at-button type="primary" size="large">Login</at-button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
#login {
  margin: 2rem auto;
  width: 455px;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);
  padding: 20px;
  padding-bottom: 60px;
  h1 {
    margin-bottom: 1rem;
    font-size: 1.6rem;
  }
  .at-input {
    font-size: inherit;
    margin-bottom: 1.6rem;
  }
  .at-btn {
    float: right;
  }
}
</style>

<script>
export default {
  name: 'Login',
  data: () => ({
      email: null,
      password: null
    }),
};
</script>
