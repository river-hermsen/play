<template>
  <div class="forgotpassword">
    <el-row justify="center" type="flex">
      <el-col :span="8">
        <el-card>
          <h1>Forgot Password</h1>
          <el-form>
            <el-form-item label="Email" prop="email">
              <el-input type="email" placeholder="example@gmail.com" v-model="formData.email"></el-input>
            </el-form-item>
            <el-form-item class="outer-btn-login">
              <el-button type="primary" @click="submitForm" class="btn-login">Send email</el-button>
            </el-form-item>
          </el-form>
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
export default {
  data() {
    return {
      formData: {
        email: ""
      }
    };
  },
  methods: {
    submitForm() {
      axios
        .post("http://localhost:5000/api/users/forgotpasword", {
          email: this.$route.query.email
        })
        .then(() => {
          this.$store.state.flashMsg.success.msg =
            "Email has been verified. \nYou can now login.";
        })
        .catch(error => {
          this.$store.state.flashMsg.error.msg = error.response.data.error;
          this.$router.push({
            name: "Login"
          });
        });
    }
  }
};
</script>