<template>
  <div id="loginForm">
    <el-form :rules="formRules" ref="loginForm" :model="formData">
      <div id="errors">
        <div class="errors" v-for="error in errors" :key="error">
          <el-alert type="error" :title="error" show-icon></el-alert>
        </div>
      </div>
      <el-form-item label="Email" prop="email">
        <el-input type="email" placeholder="example@gmail.com" v-model="formData.email"></el-input>
      </el-form-item>
      <el-form-item label="Password" prop="pwd">
        <el-input type="password" placeholder="••••••••••••" v-model="formData.pwd"></el-input>
      </el-form-item>
      <router-link to="/forgotpassword">Or forgot your password?</router-link>
      <el-form-item class="outer-btn-login">
        <el-button type="primary" @click="submitForm" class="btn-login">Login</el-button>
      </el-form-item>
    </el-form>
    <h2>Don't have an account yet?</h2>
    <router-link tag="el-button" to="/signup" class="el-button--primary">Sign Up</router-link>
  </div>
</template>

<style lang="scss" scoped>
a {
  display: inline;
  float: left;
}
.outer-btn-login {
  display: inline;
  float: right;
}
.btn-login {
  display: inline;
  float: right;
}
h2 {
  margin-top: 100px;
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
        email: "",
        pwd: ""
      },
      formRules: {
        email: [
          {
            required: true,
            message: "Please input email address",
            trigger: "blur"
          },
          {
            type: "email",
            message: "Please input correct email address",
            trigger: ["blur", "change"]
          }
        ],
        pwd: [
          {
            required: true,
            message: "Please input password field",
            trigger: "blur"
          }
        ]
      },
      errors: {}
    };
  },
  methods: {
    submitForm() {
      console.log("Submiting form...");
      axios
        .post("http://localhost:5000/api/users/login", {
          email: this.formData.email,
          pwd: this.formData.pwd
        })
        .then(res => {
          console.log(res.data);
          this.$store.dispatch("logInUser", res.data).then(() => {
            this.$router.go("/");
          });
        })
        .catch(errors => {
          if (errors.response) {
            this.errors = errors.response.data;
          } else {
            this.errors = {
              server: "Internal Server Error. Please try again later"
            };
          }
        });
    }
  }
};
</script>