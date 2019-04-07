<template>
  <div class="signup">
    <el-row justify="center" type="flex">
      <el-col :span="8">
        <el-card>
          <h1>Sign Up</h1>
          <SignUpForm/>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
// @ is an alias to /src
import SignUpForm from "@/components/SignUpForm.vue";

export default {
  name: "login",
  components: {
    SignUpForm
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

