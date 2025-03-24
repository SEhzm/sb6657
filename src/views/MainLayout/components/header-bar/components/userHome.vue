<template>
    <el-dropdown @command="handleCommand" class="right-menu-item hover-effect" trigger="hover">
        <div class="avatar-wrapper">
            <el-icon size="32">
                <User />
            </el-icon>
            <el-icon><caret-bottom /></el-icon>
        </div>
        <template #dropdown>
            <el-dropdown-menu>
                <el-dropdown-item divided>
                    <span>—内测中—</span>
                </el-dropdown-item>
                <el-dropdown-item command="login" v-show="!isRelogin">
                    <span @click="loginAndReg">登录/注册</span>
                </el-dropdown-item>
                <router-link to="/userInfo">
                    <el-dropdown-item>个人中心</el-dropdown-item>
                </router-link>
                <el-dropdown-item divided command="logout" v-show="isRelogin">
                    <span @click="logout">退出登录</span>
                </el-dropdown-item>
            </el-dropdown-menu>
        </template>
    </el-dropdown>
    <el-dialog align-center="true" v-model="loginView" draggable="true" :width=dialogWidth :modal="false" append-to-body="true">
        <login v-show="loginView" :onRegister="handleRegister" :closeDialog="closeDialog"></login>
    </el-dialog>
    <el-dialog align-center="true" v-model="registerView" draggable="true" :width=dialogWidth :modal="false" append-to-body="true" >
        <register v-show="registerView"></register>
    </el-dialog>

</template>

<script setup>
import { ElMessageBox } from 'element-plus'
import { ref } from 'vue'
import { removeToken } from '@/utils/cookieUtils';
import httpInstance from "@/apis/httpInstance";
import login from './login.vue';
import register from './register.vue';
import { useIsMobile } from '@/utils/common';
import isRelogin from '@/apis/httpInstance';
const loginView = ref(false)
const registerView = ref(false)
const isMobile = useIsMobile();

function loginAndReg() {
    console.log(isRelogin.show);
    loginView.value = true
    registerView.value = false
}

const dialogWidth = '400px'

function getDialogWidth(){
    if(isMobile){
        dialogWidth = '95%'
    }
}
function logout() {
    ElMessageBox.confirm('确定退出登录吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
    }).then(() => {
        removeToken();
    }).catch(() => { });
}

function handleRegister() {
    loginView.value = false;
    registerView.value = true;
}
function closeDialog(){
    loginView.value = false
}
</script>

<style lang='scss' scoped>
@media (min-width: 600px) {
    .DialogView {
        position: fixed;
        top: 30%;
        left: 50%;
        transform: translate(-50%, -50%);
    }
    .avatar-wrapper {
        display: block;
    }
}
:deep(.dialog-main) {
    width: 95%;
}
</style>