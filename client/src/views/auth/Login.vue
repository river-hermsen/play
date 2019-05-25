<template>
  <div class="login">
    <el-row justify="center" type="flex">
      <el-col :span="8">
        <el-card>
          <h1>Login</h1>
          <LoginForm/>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
// @ is an alias to /src
import LoginForm from "@/components/LoginForm.vue";

export default {
  name: "login",
  components: {
    LoginForm
  },
  mounted() {
    console.log(this);

    if (this.$store.state.flashMsg.error.msg) {
      this.$message({
        showClose: true,
        message: this.$store.state.flashMsg.error.msg,
        type: "error"
      });
      this.$store.state.flashMsg.error.msg = "";
    } else if (this.$store.state.flashMsg.success.msg) {
      this.$message({
        showClose: true,
        message: this.$store.state.flashMsg.success.msg,
        type: "success"
      });
      this.$store.state.flashMsg.success.msg = "";
    }
  }
};
</script>

<style lang="scss" scoped>
h1 {
  margin-bottom: 1em;
}
.el-card {
  margin-top: 2rem;
}

.el-notification__title {
  font-family: "Poppins", sans-serif;
}
</style>

