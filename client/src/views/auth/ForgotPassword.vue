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
    submitForm() {}
  }
};
</script>