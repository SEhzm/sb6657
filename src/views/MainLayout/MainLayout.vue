<template>
    <div>
        <HeaderBar></HeaderBar>
        <div class="tab">
            <!-- 移动端 -->
            <div class="tab-container">
                <div v-for="(item, index) in MemeCategory"
                    :class="`tab1 ${item.path === route.path ? 'selected' : 'none'}`" :key="item.path"
                    @click="navigateTo(item.path)">
                    {{ item.text }}
                </div>
            </div>
        </div>

        <div class="main-content">
            <div class="sidebar">
                <el-menu router class="sidebar-el-menu" :default-active="$route.path">
                    <el-menu-item v-for="(category, index) in MemeCategory" v-bind:key="category.path"
                        :index="category.path">
                        <div class="sidebar-icon">
                            <img :src="category.icon" alt="" />
                        </div>
                        <span>{{ category.text }}</span>
                    </el-menu-item>
                </el-menu>
            </div>
            <div class="content">
                <router-view />
            </div>
        </div>
        <FooterBar></FooterBar>
    </div>
    <a href="https://github.com/SEhzm/sb6657/blob/master/%E6%9B%B4%E6%96%B0%E6%97%A5%E5%BF%97.md"><span
            class="version">版本: {{ sbVersion }}</span></a>
  <div class="GuangGaoWei"> 
    <img  src="https://pic1.imgdb.cn/item/67ee15fe0ba3d5a1d7eb91d2.png" alt="">
    <span style="display: flex;font-size: small;">广告位招租</span>
  </div>
</template>

<script setup lang="ts">
import HeaderBar from '@/views/MainLayout/components/header-bar/header-bar.vue';
import FooterBar from '@/views/MainLayout/components/footer-bar.vue';
import { useRoute, useRouter } from 'vue-router';
import { MemeCategory } from '@/constants/backend';
import { sbVersion } from '@/apis/httpInstance'
const route = useRoute();
const router = useRouter();
function navigateTo(path: string) {
    router.push(path);
}
</script>

<style lang="scss" scoped>
@media (min-width: 601px) {

    .tab {
        display: none;
    }

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

    .header {
        height: 55px;
        display: flex;
        align-items: center;
        width: 100%;
        z-index: 1000;
    }

    .main-content {
        display: flex;
    }

    .sidebar {
        width: auto;
        border-right: 0px solid #ddd;
        min-height: calc(100vh - 60px);

        .sidebar-el-menu {
            top: 50px;
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

    .content {
        flex: 1;
        width: 0;
        padding: 10px;
    }

    .version {
        color: black;
        position: fixed;
        right: 10px;
        bottom: 5px;
        z-index: 1000;
        font-size: 10px;
    }

    .GuangGaoWei {
        position: fixed;
        top: 30%;
        right: 0px;
        z-index: -1;
    }
}

@media (max-width: 600px) {
    .sidebar {
        display: none;
    }

    //移动端
    .tab {
        display: flex;
        overflow-x: scroll;
        white-space: nowrap;
        scrollbar-width: none; // 确保 Firefox 也隐藏滚动条
        -ms-overflow-style: none; // IE 和 Edge
        -webkit-overflow-scrolling: touch; // 启用原生滚动效果
        touch-action: pan-x; // 允许水平滚动，阻止其他触摸行为
    }

    .tab-container {
        display: flex;
        flex-wrap: nowrap;
        width: 100%;
    }

    .tab1 {
        position: relative;
        white-space: nowrap;
        padding: 10px 5px;
        margin-right: 10px;
        border-radius: 15px 15px 0 0;
        transition: all 0.3s ease;
        font-size: 14px;
        color: #000000;
        background-color: #fff;
        flex-shrink: 0; // 防止缩小
        touch-action: pan-x;
    }

    .tab1::before {
        content: '';
        position: absolute;
        left: 0;
        width: 100%;
        background-color: transparent;
        transition: all 0.3s ease;
    }

    .none {
        background-color: #93a2b9;
        padding: 10px;
    }

    .tab1:hover,
    .selected {
        color: #fff;
        background-color: #007bff;

        &::before {
            background-color: #007bff;
        }

        padding-left: 15px;
        padding-right: 15px;
    }

    .tab::-webkit-scrollbar {
        /* Webkit browsers (Chrome, Safari) */
        height: 8px;
    }

    .tab::-webkit-scrollbar-track {
        background: transparent;
    }

    .tab::-webkit-scrollbar-thumb {
        background-color: rgba(0, 0, 0, 0.2);
        border-radius: 10px;
    }

    .version {
        color: black;
        position: fixed;
        right: 20px;
        bottom: 0px;
        z-index: 1000;
        font-size: .5rem;
    }
    .GuangGaoWei{
        display: none;
    }
}
</style>
