<template>
    <el-dropdown @command="handleCommand" class="right-menu-item hover-effect" trigger="hover">
        <div class="avatar-wrapper">
            <el-icon size="32"><User /></el-icon>
            <el-icon><caret-bottom /></el-icon>
        </div>
        <template #dropdown>
            <el-dropdown-menu>
              <router-link to="/user/profile">
                <el-dropdown-item>个人中心</el-dropdown-item>
              </router-link>
              <el-dropdown-item divided command="logout">
                <span>退出登录</span>
              </el-dropdown-item>
            </el-dropdown-menu>
        </template>
    </el-dropdown>
</template>

<script setup>


</script>

<style lang='scss' scoped></style>