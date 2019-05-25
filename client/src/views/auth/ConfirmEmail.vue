<template>
  <div class="forgotpassword">
    <el-row justify="center" type="flex">
      <el-col :span="8">
        <el-card>
          <h1>Confirming Email....</h1>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>
<style lang="scss" scoped>
.el-card {
  margin-top: 2rem;
}
</style>

<script>
import axios from "axios";

export default {
  data() {
    return {};
  },
  created() {
    if (
      this.$route.query.token &&
      this.$route.query.email &&
      this.$route.query.token.length == 32
    ) {
      axios
        .post("http://localhost:5000/api/users/confirmemail", {
          token: this.$route.query.token,
          email: this.$route.query.email
        })
        .then(res => {
          this.$store.state.flashMsg.success.msg =
            "Email has been verified. \nYou can now login.";

          this.$router.push({ name: "Login" });
        })
        .catch(error => {
          this.$store.state.flashMsg.error.msg = error.response.data.error;
          this.$router.push({
            name: "Login"
          });
        });
    } else {
      this.$router.push("login");
    }
  }
};
</script>