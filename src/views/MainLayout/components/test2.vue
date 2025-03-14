<template>
    <el-dropdown @command="handleCommand" class="right-menu-item hover-effect" trigger="hover">
        <div class="avatar-wrapper">
            <el-icon size="32"><User /></el-icon>
            <el-icon><caret-bottom /></el-icon>
        </div>
        <template #dropdown>
            <el-dropdown-menu>
                <el-dropdown-item>个人中心</el-dropdown-item>
                <el-dropdown-item>
                    <span>退出登录</span>
                </el-dropdown-item>
            </el-dropdown-menu>
        </template>
    </el-dropdown>
</template>

<script setup>


</script>

<style lang='scss' scoped></style>