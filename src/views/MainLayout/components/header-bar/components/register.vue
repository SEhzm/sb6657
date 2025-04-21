<template>
  <div>
    <el-form ref="registerRef" :model="registerForm" :rules="registerRules" class="register-form">
      <h3 class="title">注册</h3>
      <el-form-item prop="username">
        <el-input v-model="registerForm.username" type="text" size="large" clearable prefix-icon="Avatar"
          auto-complete="off" placeholder="邮箱-用于登录">
          <template #append>
            <el-button type="primary" size="small" style="padding: 0;font-weight: 500;"
              @click="getEmailCode">发送邮箱验证码</el-button>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="registerForm.nickName" type="text" maxlength="10" size="large" clearable
          placeholder="昵称--平台昵称--后续不可更改">
        </el-input>
      </el-form-item>
      <!-- 邮箱验证码输入框 -->
      <el-form-item prop="emailCode">
        <el-input v-model="registerForm.emailCode" type="text" maxlength="4" size="large" clearable
          placeholder="请输入邮箱验证码">
        </el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input v-model="registerForm.password" type="password" size="large" show-password prefix-icon="Lock"
          auto-complete="off" placeholder="密码" @keyup.enter="handleRegister">
        </el-input>
      </el-form-item>
      <el-form-item prop="confirmPassword">
        <el-input v-model="registerForm.confirmPassword" type="password" size="large" show-password prefix-icon="Lock"
          auto-complete="off" placeholder="确认密码" @keyup.enter="handleRegister">

        </el-input>
      </el-form-item>
      <el-form-item prop="code" v-if="captchaEnabled">
        <el-input size="large" v-model="registerForm.code" auto-complete="off" clearable
          placeholder="请输入右侧验证码" style="width: 63%" @keyup.enter="handleRegister">
          <template #prefix><img src="@/assets/icons/validCode.svg" style="width: 16px;"></template>
        </el-input>
        <div class="register-code">
          <img :src="codeUrl" @click="getCode" class="register-code-img" />
        </div>
      </el-form-item>
      <el-form-item style="width:100%;">
        <el-button :loading="loading" size="large" type="primary" style="width:100%;" @click.prevent="handleRegister">
          <span v-if="!loading">注 册</span>
          <span v-else>注 册 中...</span>
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup>
import { ElMessageBox, ElMessage } from "element-plus";
import httpInstance from "@/apis/httpInstance";

const registerRef = ref()
const registerForm = ref({
  username: "",
  nickName: "",
  password: "",
  confirmPassword: "",
  code: "",
  uuid: "",
  emailCode: "",

});

const equalToPassword = (rule, value, callback) => {
  if (registerForm.value.password !== value) {
    callback(new Error("两次输入的密码不一致"));
  } else {
    callback();
  }
};

const registerRules = {
  username: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { pattern: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/, message: '请输入有效的邮箱地址', trigger: 'blur' }
  ],
  password: [
    { required: true, trigger: "blur", message: "请输入您的密码" },
    { min: 6, max: 20, message: "用户密码长度必须介于 6 和 20 之间，且数字和英文混合", trigger: "blur" },
    { pattern: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,20}$/, message: "密码必须是数字和英文混合", trigger: "blur" }
  ],
  confirmPassword: [
    { required: true, trigger: "blur", message: "请再次输入您的密码" },
    { required: true, validator: equalToPassword, trigger: "blur" }
  ],
  code: [{ required: true, trigger: "change", message: "请输入验证码" }],
  emailCode: [{ required: true, trigger: "change", message: "请输入邮箱验证码" }],
};

const codeUrl = ref("");
const loading = ref(false);
const captchaEnabled = ref(true);

const emailCodeButtonText = ref("发送邮箱验证码");
const emailCodeButtonDisabled = ref(false);
let emailCodeTimer = null;

function getEmailCode() {
  if (!registerForm.value.username) {
    ElMessage.info("请先输入邮箱");
    return;
  }

  emailCodeButtonDisabled.value = true;
  let count = 10;
  emailCodeButtonText.value = `${count}分钟 后重试`;

  emailCodeTimer = setInterval(() => {
    count--;
    if (count <= 0) {
      clearInterval(emailCodeTimer);
      emailCodeButtonDisabled.value = false;
      emailCodeButtonText.value = "发送邮箱验证码";
    } else {
      emailCodeButtonText.value = `邮箱中已有验证码，或请 ${count}分钟 后重试`;
    }
  }, 1000 * 60 * 10);
  console.log(registerForm.value.username);

  // 发送请求
  httpInstance.get("/login/getMailCode", {
    params: {
      toEMail: registerForm.value.username
    }
  }).then(res => {
    if (res.code === 200) {
      ElMessage.success("验证码已发送，请查收邮箱");
    } else {
      ElMessage.error(res.msg);
      clearInterval(emailCodeTimer);
      emailCodeButtonDisabled.value = false;
      emailCodeButtonText.value = "发送邮箱验证码";
    }
  })
    .catch(() => {
      clearInterval(emailCodeTimer);
      emailCodeButtonDisabled.value = false;
      emailCodeButtonText.value = "发送邮箱验证码";
    });
}
function handleRegister() {
  registerRef.value.validate(valid => {
    if (valid) {
      loading.value = true;
      httpInstance.post('/register', registerForm.value).then(res => {
        const username = registerForm.value.username;
        if (res.code === 200) {
          ElMessageBox.alert("<font color='red'>恭喜你，您的账号 " + username + " 注册成功！</font>", "系统提示", {
            dangerouslyUseHTMLString: true,
            type: "success",
          }).then(() => {
            //注册成功后的操作，跳转到登录页面
          }).catch(() => { });
        } else {
          ElMessage.error(res.msg)
          loading.value = false;
          if (captchaEnabled) {
            getCode();
          }
        }

      }).catch(() => {
        loading.value = false;
        if (captchaEnabled) {
          getCode();
        }
      });
    }
  });
}

function getCode() {
  httpInstance.get('/captchaImage').then(res => {
    captchaEnabled.value = res.captchaEnabled === undefined ? true : res.captchaEnabled;
    if (captchaEnabled.value) {
      codeUrl.value = "data:image/gif;base64," + res.img;
      registerForm.value.uuid = res.uuid;
    }
  });
}

getCode();
</script>

<style lang='scss' scoped>


.title {
  margin: 0px auto 30px auto;
  text-align: center;
  color: #707070;
}

.register-form {
  width: 100%;
  .el-input {
    height: 40px;

    input {
      height: 40px;
    }
  }

  .input-icon {
    height: 39px;
    width: 14px;
    margin-left: 0px;
  }
}

.register-tip {
  font-size: 13px;
  text-align: center;
  color: #bfbfbf;
}

.register-code {
  width: 33%;
  height: 40px;
  float: right;

  img {
    cursor: pointer;
    vertical-align: middle;
  }
}

.el-register-footer {
  height: 40px;
  line-height: 40px;
  position: fixed;
  bottom: 0;
  width: 100%;
  text-align: center;
  color: #000000;
  font-family: Arial;
  font-size: 12px;
  letter-spacing: 1px;
}

.register-code-img {
  height: 40px;
  padding-left: 12px;
}

@media (max-width: 601px) {
  .register {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 224px;
    background-image: url("../assets/images/login-background.jpg");
    background-size: cover;
  }
}
</style>
