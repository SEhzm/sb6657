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
    <RouterLink to="/update">
        <span class="version">版本: {{ sbVersion }}</span>
    </RouterLink>
   <div class="GuangGaoWei">
        <el-popover :visible="popoverVisible" placement="top" title="甲方要求150人注册。ありがとう米娜桑" :width="310">
            <template #reference>
                <a :href="adLink" target="_blank">
                    <img :style="adImageStyle" :src="adImage" alt="">
                    <!-- <span style="display: flex;font-size:large;color: white;">广告位招租</span> -->
                </a>
            </template>
            <div class="popover-content">
                <p>为了甲方爸爸继续支持我们，各位爹注册一下吧🙏，凑凑人头吧，祝你们长生不老永远不死。🙇<el-button type="primary" size="small" @click="popoverVisible = false">关闭</el-button></p>
            </div>
        </el-popover>
    </div>
    <div class="GuiBin">当前直播间贵宾数:{{ OniValue }}</div>
</template>

<script setup lang="ts">
import HeaderBar from '@/views/MainLayout/components/header-bar/header-bar.vue';
import FooterBar from '@/views/MainLayout/components/footer-bar.vue';
import { useRoute, useRouter } from 'vue-router';
import { MemeCategory } from '@/constants/backend';
import { sbVersion } from '@/apis/httpInstance'
import { useGuiBinStore } from '@/stores/GuiBinStore';
import DouyuWebSocket from '@/utils/douyuWebSocket';
import { computed, onMounted, ref, watch } from 'vue';
import { handleDanmu } from '@/utils/douyuWebSocket';
import { useMemeTagsStore } from '@/stores/memeTags';
import { ElNotification } from 'element-plus';
import { RouterLink } from 'vue-router'
import { useIsMobile } from '@/utils/common';

const route = useRoute();
const router = useRouter();
const isMobile = useIsMobile();

const guiBinStore = useGuiBinStore();
const memeTagsStore = useMemeTagsStore();
memeTagsStore.setMemeTags()

const OniValue = computed(() => guiBinStore.Oni);

// Popover 显示状态 - 默认显示，但移动端为 false
const popoverVisible = ref(!isMobile.value);

// 监听移动端状态变化
watch(isMobile, (newVal) => {
    if (newVal) {
        popoverVisible.value = false;
    }
});

// 关闭 Popover
const closePopover = () => {
    popoverVisible.value = false;
};

// 广告位图片和链接根据当前路由动态切换
const adImage = computed(() => {
    return route.path === '/' || route.path === '/home'
        ? 'https://pic1.imgdb.cn/item/6a05712957da1d412e138abd.jpg'
        : 'https://pic1.imgdb.cn/item/6a05712a57da1d412e138abe.png';
});

const adLink = computed(() => {
    return 'https://yousheng186.com/activity/login/1?promotionCode=6657';
});

// 广告位图片样式根据当前路由动态切换
const adImageStyle = computed(() => {
    return route.path === '/' || route.path === '/home'
        ? 'width: 350px; height: auto;'
        : 'width: 220px; height: auto;';
});

const socket = ref();
onMounted(() => {
    /**
     * ================================================================
     * 首屏加载完之后去除loading页
     */
    const loadingDOM = document.querySelector('#global-loading');
    if (loadingDOM) {
        loadingDOM.classList.add('fade-out');
        setTimeout(() => loadingDOM.remove(), 500);
    }
    /**
     * ================================================================
     */

    socket.value = new DouyuWebSocket(6979222, handleDanmu);
});
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
        margin-bottom: 40px;
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
        z-index: 999;

        .popover-content {
            text-align: center;

            p {
                margin-bottom: 15px;
                font-size: 14px;
                color: #333;
            }
        }
    }

    .GuiBin {
        font-size: 11px;
        position: fixed;
        bottom: 0;
        left: 0px;
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

    .GuangGaoWei {
        display: none;
    }
    .GuiBin {
        font-size: .5rem;
        position: fixed;
        bottom: 0;
        left: 0px;
        z-index: 100;
    }
}
</style>
