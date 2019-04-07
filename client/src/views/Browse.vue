<template>
  <div>
    <h1>Hi {{this.userInfo.username}}</h1>
  </div>
</template>

<script>
export default {
  data() {
    return {
      userInfo: {
        username: "",
        email: ""
      }
    };
  },
  mounted() {
    this.$store.dispatch("getUserInfo").then(userInfo => {
      this.userInfo.username = userInfo.username;
      this.userInfo.email = userInfo.email;
    });
  },
  methods: {}
};
</script>
