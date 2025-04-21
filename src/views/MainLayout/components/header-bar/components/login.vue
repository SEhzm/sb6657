<template>
  <div>
    <div class="login-box">
      <div class="title">登 录</div>
      <el-form :model="loginForm" ref="formRef" :rules="rules">
        <el-form-item prop="username">
          <el-input prefix-icon="Avatar" size="large" clearable v-model="loginForm.username" placeholder="请输入邮箱" />
        </el-form-item>
        <el-form-item prop="password">
          <el-input show-password size="large" prefix-icon="Lock" v-model="loginForm.password" placeholder="请输入密码" />
        </el-form-item>
        <el-form-item prop="code">
          <el-input v-model="loginForm.code" size="large" clearable auto-complete="off" placeholder="请输入验证码"
            style="width: 63%">
            <template #prefix><img src="@/assets/icons/validCode.svg" style="width: 16px;"></template>
          </el-input>
          <div class="login-code">
            <img :src="codeUrl" @click="getCode" class="login-code-img" @keyup.enter="login" />
          </div>
        </el-form-item>
        <el-checkbox v-model="loginForm.rememberMe" style="margin:0px 0px 5px 0px;">记住密码</el-checkbox>
        <span style="margin-left: 35%;cursor: pointer;color: blue;" @click="reg">还没有账号？去注册 ></span>
        <br>
        <el-popover placement="top-start" width="auto" trigger="hover"
          content="请使用登陆邮箱发送邮件至邮箱 he20020928@foxmail.com，申请重置密码~">
          <template #reference>
            <span>🔔忘记密码？</span>
          </template>
        </el-popover>
        
        <el-form-item>
          <el-button :loading="loading" type="primary" style="width: 100%" @click="login">
            <span v-if="!loading">登 录</span>
            <span v-else>登 录 中...</span>
          </el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, defineProps } from "vue"
import httpInstance from "@/apis/httpInstance";
import { ElMessage } from "element-plus";
import Cookies from "js-cookie";
import { setToken } from "@/utils/cookieUtils"
import { decrypt, encrypt } from "@/utils/jsencrypt";

const props = defineProps({
  onRegister: {
    type: Function,
    required: true
  },
  closeDialog: {
    type: Function,
    required: true
  }
});

const codeUrl = ref("");
const loading = ref(false);
const loginForm = ref({
  username: "",
  password: "",
  rememberMe: false,
  code: "",
  uuid: ""
});
const rules = reactive({
  username: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
  ],
  code: [
    { required: true, message: '请输入验证码', trigger: "change" }
  ]
})
const formRef = ref()

function login() {
  formRef.value.validate((valid) => {
    if (valid) {
      loading.value = true;
      if (loginForm.value.rememberMe) {
        Cookies.set("username", loginForm.value.username, { expires: 525600 });
        Cookies.set("password", encrypt(loginForm.value.password), { expires: 525600 });
        Cookies.set("rememberMe", loginForm.value.rememberMe, { expires: 525600 });
      } else {
        // 否则移除
        Cookies.remove("username");
        Cookies.remove("password");
        Cookies.remove("rememberMe");
      }
      httpInstance.post('/login', loginForm.value).then(res => {
        if (res.code === 200) {
          ElMessage.success('登录成功')
          setToken(res.token);
          closeDialog();
        } else {
          loading.value = false;
          ElMessage.error(res.msg)
        }
      }).catch(() => {
        loading.value = false;
        if (captchaEnabled.value) {
          getCode();
        }
      })
    }
  })
}
const captchaEnabled = ref(true);
function getCode() {
  httpInstance.get('/captchaImage').then(res => {
    captchaEnabled.value = res.captchaEnabled === undefined ? true : res.captchaEnabled;
    if (captchaEnabled.value) {
      codeUrl.value = "data:image/gif;base64," + res.img;
      loginForm.value.uuid = res.uuid;
    }
  });
}
function getCookie() {
  const username = Cookies.get("username");
  const password = Cookies.get("password");
  const rememberMe = Cookies.get("rememberMe");
  loginForm.value = {
    username: username === undefined ? loginForm.value.username : username,
    password: password === undefined ? loginForm.value.password : decrypt(password),
    rememberMe: rememberMe === undefined ? false : Boolean(rememberMe)
  };
}
getCookie();
getCode();

function reg() {
  if (typeof props.onRegister === 'function') {
    props.onRegister();
  } else {
    console.error('onRegister is not a function');
  }
}

function closeDialog() {
  props.closeDialog();
}
</script>

<style scoped lang="scss">
.title {
  text-align: center;
  color: #707070;
}

.login-code-img {
  height: 38px;
  margin-left: 12px;
}

.login-code {
  width: 33%;
  height: 40px;
  float: right;

  img {
    cursor: pointer;
    vertical-align: middle;
  }
}
</style>