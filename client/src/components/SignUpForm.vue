<template>
  <div id="signUpForm">
    <el-form ref="signUpForm">
      <div id="errors">
        <div class="errors" v-for="error in errors" :key="error">
          <el-alert type="error" :title="error" show-icon></el-alert>
        </div>
      </div>
      <!-- <el-alert title="Password must be between 6 and 32 characters" type="error" show-icon></el-alert> -->
      <el-form-item label="Username">
        <el-input type="email" placeholder="MyUsername" v-model="formData.username"></el-input>
      </el-form-item>
      <el-form-item label="Email">
        <el-input type="email" placeholder="example@gmail.com" v-model="formData.email"></el-input>
      </el-form-item>
      <el-form-item label="Password">
        <el-input type="password" placeholder="••••••••••••" v-model="formData.pwd1"></el-input>
      </el-form-item>
      <el-form-item label="Confirm password">
        <el-input type="password" placeholder="••••••••••••" v-model="formData.pwd2"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm()">Sign Up</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<style lang="scss">
.errors {
  margin-bottom: 17px;
}
.el-alert {
  margin-top: 20px;
}
.el-alert__title {
  font-size: 14px;
  font-weight: bold;
}
.el-form--label-top .el-form-item__label {
  padding-bottom: 0px;
}
</style>

<script>
import axios from "axios";
export default {
  data() {
    return {
      formData: {
        username: "",
        email: "",
        pwd1: "",
        pwd2: ""
      },
      errors: {}
    };
  },
  methods: {
    submitForm() {
      console.log("Submitting form...");
      axios
        .post("http://localhost:5000/api/users/signup", {
          username: this.formData.username,
          email: this.formData.email,
          pwd1: this.formData.pwd1,
          pwd2: this.formData.pwd2
        })
        .then(res => {
          console.log(res);
        })
        .catch(errors => {
          this.errors = errors.response.data;
        });

      // axios.post("http://localhost:5000/api/users/test").then(response => {
      //   console.log(response);
      // });
    }
  }
};
</script>