<template>
  <div id="loginForm">
    <el-form :rules="formRules">
      <el-form-item label="Email" prop="email">
        <el-input type="email" placeholder="example@gmail.com" v-model="formData.email"></el-input>
      </el-form-item>
      <el-form-item label="Password" prop="pwd">
        <el-input type="password" placeholder="••••••••••••" v-model="formData.pwd"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary">Login</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<style lang="scss" scoped>
.el-form--label-top .el-form-item__label {
  padding-bottom: 0px;
}
</style>

<script>
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
      }
    };
  }
};
</script>