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
                <router-link divided to="/me-post">
                    <el-dropdown-item>我的帖子</el-dropdown-item>
                </router-link>
                <router-link divided to="/me-memes">
                    <el-dropdown-item>我的投稿</el-dropdown-item>
                </router-link>
                <el-dropdown-item command="login" divided v-show="!isRelogin">
                    <span @click="loginAndReg">登录/注册</span>
                </el-dropdown-item>
                <router-link to="/userInfo">
                    <el-dropdown-item>个人中心</el-dropdown-item>
                </router-link>
                <el-dropdown-item command="login">
                    <span @click="ysCommunityNorms = true">隐私政策</span>
                </el-dropdown-item>
                <el-dropdown-item divided command="logout" v-show="isRelogin">
                    <span @click="logout">退出登录</span>
                </el-dropdown-item>
            </el-dropdown-menu>
        </template>
    </el-dropdown>
    <el-dialog align-center="true" v-model="loginView" draggable="true" :width=dialogWidth :modal="false"
        append-to-body="true">
        <login v-show="loginView" :onRegister="handleRegister" :closeDialog="closeDialog"></login>
    </el-dialog>
    <el-dialog align-center="true" v-model="registerView" draggable="true" :width=dialogWidth :modal="false"
        append-to-body="true">
        <register v-show="registerView"></register>
    </el-dialog>

    <el-dialog v-model="ysCommunityNorms" title="社区规范与隐私政策"
        style="position: fixed;top: 0; left: 0; right: 0; bottom: 0; margin: auto;" :width=dialogWidth :modal="false"
        append-to-body="true">
        <div v-html="CommunityNorms"></div>
    </el-dialog>
</template>

<script setup>
import { ElMessageBox } from 'element-plus'
import { ref, onMounted, onBeforeUnmount, } from 'vue'
import { removeToken } from '@/utils/cookieUtils';
import httpInstance from "@/apis/httpInstance";
import login from './login.vue';
import { CommunityNorms } from '@/common/CommunityNorms'
import register from './register.vue';
import { useIsMobile } from '@/utils/common';
import isRelogin from '@/apis/httpInstance';
import { useAuthStore } from '@/stores/useAuthStore'

const authStore = useAuthStore()


const loginView = ref(false)
const registerView = ref(false)
const isMobile = useIsMobile();


const ysCommunityNorms = ref(false)
function loginAndReg() {
    // console.log(isRelogin.show);
    loginView.value = true
    registerView.value = false
}

let dialogWidth = '400px'

function getDialogWidth() {
    if (isMobile.value) {
        dialogWidth = '95%'
    }
}
getDialogWidth()
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
function closeDialog() {
    loginView.value = false
}

function showLoginView() {
    console.log('showLoginView')
    loginView.value = true
}

watch(
    () => authStore.loginVisible,
    (newVal) => {
        loginView.value = newVal
    }
)
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
        height: 32px;
        cursor: pointer;
        display: block;
    }
}

@media (max-width: 600px) {
    .avatar-wrapper {
        height: 26px;
        cursor: pointer;
        display: block;
    }
}

:deep(.dialog-main) {
    width: 95%;
}
</style>