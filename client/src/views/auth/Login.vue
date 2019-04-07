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
</style>

