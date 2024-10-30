<template>
    <div>
        <HeaderBar></HeaderBar>
        <div class="tab">
            <!-- 移动端 -->
            <div class="tab-container">
                <div :class="`tab1 ${item.path === route.path ? 'selected' : 'none'}`" v-for="(item, index) in table"
                    :key="item.path" @click="navigateTo(item.path)">
                    {{ item.text }}
                </div>
            </div>
        </div>

        <div class="main-content" style="position: relative;">
            <div class="sidebar">
                <el-menu router style="border: none; margin-right: auto" :default-active="$route.path">
                    <el-menu-item index="/home">
                        <el-icon>
                            <HomeFilled />
                        </el-icon>
                        <span>首页</span>
                    </el-menu-item>

                    <el-menu-item index="/AllBarrage">
                        <el-icon>
                            <List />
                        </el-icon>
                        <span>全部烂梗</span>
                    </el-menu-item>

                    <el-menu-item index="/image">
                        <el-icon>
                            <Camera />
                        </el-icon>
                        <span>时光相册</span>
                    </el-menu-item>

                    <el-menu-item index="/penWJQ">
                        <el-icon>玩</el-icon>
                        <span>喷玩机器篇</span>
                    </el-menu-item>

                    <el-menu-item index="/mygo">
                        <el-icon>
                            <Female />
                        </el-icon>
                        <span>木柜子篇</span>
                    </el-menu-item>

                    <el-menu-item index="/ZbjHuPen">
                        <el-icon>
                            <ChatDotRound />
                        </el-icon>
                        <span>直播间互喷篇</span>
                    </el-menu-item>

                    <el-menu-item index="/penPlayer">
                        <el-icon>🦐</el-icon>
                        <span>喷选手篇</span>
                    </el-menu-item>

                    <el-menu-item index="/p1">
                        <el-icon>
                            <plus />
                        </el-icon>
                        <span>+1篇</span>
                    </el-menu-item>

                    <el-menu-item index="/QMLW">
                        <el-icon>
                            <User />
                        </el-icon>
                        <span>群魔乱舞篇</span>
                    </el-menu-item>

                    <el-menu-item index="/QUQU">
                        <img src="@/assets/imgs/Z.png" alt="Z!!" class="menu-icon" />
                        <span>QUQU篇</span>
                    </el-menu-item>
                </el-menu>
            </div>
            <div class="content">
                <router-view />
            </div>
        </div>
        <FooterBar></FooterBar>
    </div>
</template>


<script setup lang="ts">
import HeaderBar from "@/views/MainLayout/components/header-bar/header-bar.vue";
import FooterBar from "@/views/MainLayout/components/footer-bar.vue";
import { useRoute, useRouter } from "vue-router";
import { ref } from "vue";

const table = [
    { text: "首页", path: "/home" },
    { text: "+1", path: "/p1" },
    { text: "喷玩机器篇", path: "/penWJQ" },
    { text: "木柜子篇", path: "/mygo" },
    { text: "喷选手篇", path: "/penPlayer" },
    { text: "群魔乱舞篇", path: "/QMLW" },
    { text: "全部烂梗", path: "/AllBarrage" },
    { text: "QUQU篇", path: "/QUQU" },
    { text: "时光相册", path: "/image" },
];
const route = useRoute();
const router = useRouter();
function navigateTo(path: string) {
    router.push(path);
}

const $route = useRoute();
console.log($route.path);
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
        content: "";
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
        /* 左侧 padding 增加 10px */
        padding-right: 15px;
        /* 右侧 padding 增加 10px */

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
}
</style>