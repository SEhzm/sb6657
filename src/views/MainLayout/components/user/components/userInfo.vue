<template>
   <el-form ref="userRef" :model="form" :rules="rules" label-width="80px">
      <el-form-item label="邮箱" prop="nickName">
         <el-input v-model="form.nickName" disabled maxlength="30" />
      </el-form-item>
      <el-form-item label="测试" prop="phonenumber">
         <el-input v-model="form.phonenumber" disabled maxlength="11" />
      </el-form-item>
      <el-form-item label="测试" prop="email">
         <el-input v-model="form.email" disabled maxlength="50" />
      </el-form-item>
      <el-form-item>
      </el-form-item>
   </el-form>
</template>

<script setup>

const props = defineProps({
  user: {
    type: Object
  }
});

const { proxy } = getCurrentInstance();

const form = ref({});


/** 关闭按钮 */
function close() {
  proxy.$tab.closePage();
};

// 回显当前登录用户信息
watch(() => props.user, user => {
  if (user) {
    form.value = { nickName: user.nickName, phonenumber: user.phonenumber, email: user.email, sex: user.sex };
  }
},{ immediate: true });
</script>
