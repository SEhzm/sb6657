<template>
    <div class="sidebar">
        <el-menu router class="sidebar-el-menu" :default-active="route.path">
            <el-menu-item v-for="category in MemeCategory" :key="category.path" :index="category.path">
                <div class="sidebar-icon">
                    <img :src="category.icon" alt="" />
                </div>
                <span>{{ category.text }}</span>
            </el-menu-item>
        </el-menu>
    </div>
</template>

<script setup lang="ts">
import { MemeCategory } from '@/constants/backend';
import { useRoute } from 'vue-router';

const route = useRoute();
</script>

<style lang="scss" scoped>
.el-menu {
    background-color: transparent !important;
}

.el-menu-item,
.el-sub-menu .el-menu-item {
    color: black;
    background-color: transparent !important;
}

.el-menu-item.is-active,
.el-sub-menu .el-menu-item.is-active {
    background-color: rgba(255, 255, 255, 0.5) !important;
    color: black;
    border-radius: 5px;
}

.el-menu.el-menu--vertical.v-enter-to {
    background-color: rgba(255, 255, 255, 0) !important;
}

.el-menu .el-menu-item:hover {
    outline: 0 !important;
    color: #2e95fb !important;
    background: linear-gradient(270deg, #f2f7fc 0%, #fefefe 100%) !important;
    border-radius: 5px;
}

.sidebar {
    width: auto;
    border-right: 0px solid #ddd;
    min-height: calc(100vh - 60px);

    .sidebar-el-menu {
        top: 55px;
        position: sticky;
        border: none;
        margin-right: auto;
    }

    .sidebar-icon {
        height: 18px;
        width: 18px;
        display: flex;
        justify-content: center;
        align-items: center;
        margin-right: 5px;

        img {
            height: 18px;
            width: 18px;
        }
    }
}

.menu-icon {
    height: 18px;
    margin-right: 10px;
}
</style>
