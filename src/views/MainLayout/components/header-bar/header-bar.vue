<template>
    <div class="header">
        <div class="header-content">
            <a href="https://www.douyu.com/6657" target="_blank" class="logo-link">
                <img src="/public/favicon.ico" alt="大🐖头" class="logo-img" />
                <p class="header-title">斗鱼玩机器烂梗收集</p>
            </a>

            <div class="header-actions">
                <img v-if="showHotMeme" src="@/assets/imgs/hot.png" alt="热门" class="hot-barrage-img" @click="openHotMeme24h" />
                <div v-if="showHotMeme" @click="openHotMeme24h" class="hot-barrage">
                    <transition name="fade">
                        <span :key="rotationIndex" class="hot-barrage-span">热门：{{ hotMeme24h?.[rotationIndex]?.content || '' }}</span>
                    </transition>
                </div>

                <div class="elinput">
                    <el-input v-model="searchKey" placeholder="搜索烂梗" clearable @keydown.enter="handleSearchMeme">
                        <template #append>
                            <el-button type="primary" @click="handleSearchMeme">
                                <el-icon>
                                    <Search />
                                </el-icon>
                            </el-button>
                        </template>
                    </el-input>
                </div>

                <el-button type="primary" @click="complaintButton" class="complaint-button">
                    <span>
                        上传照片
                        <br />
                        建议/提交BUG
                    </span>
                </el-button>
                <a href="https://sb6657.cn/#/Tampermonkey">
                    <img src="https://pic.imgdb.cn/item/6704f830d29ded1a8c738f70.png" alt="gitee" class="icon-img" />
                </a>
                <a href="https://yuba.douyu.com/feed/2639094748291342931" target="_blank">
                    <img src="@/assets/imgs/douyu.png" alt="douyu" class="icon-img" />
                </a>
                <a href="https://github.com/SEhzm/sb6657/" target="_blank">
                    <img src="@/assets/imgs/github.png" alt="github" class="icon-img" />
                </a>
                <el-image class="icon-img-rounded" :src="lightningUrl" :hide-on-click-modal="true" :zoom-rate="1.2" :max-scale="7" lazy :min-scale="0.2" :preview-src-list="['http://cdn.dgq63136.icu/zfb.jpg']" :initial-index="4" fit="cover" />
                <el-image class="icon-img-rounded" :src="wxurl" :hide-on-click-modal="true" :zoom-rate="1.2" lazy :max-scale="7" :min-scale="0.2" :preview-src-list="['http://cdn.dgq63136.icu/wx.jpg']" :initial-index="4" fit="cover" />
            </div>
        </div>

        <!-- 24h热门弹幕对话框 -->
        <memeDialog v-model="showHotMeme24h" :memeArr="hotMeme24h" :loading="hotMeme24hLoading" :emptyText="loadingTips" @refresh="refreshHotMeme24h">
            <div class="dialog-header">
                <div>24h热门烂梗</div>
                <div><el-button @click="openHotMeme7d">查看近七天热门</el-button></div>
            </div>
        </memeDialog>
        <!-- 7天热门弹幕对话框 -->
        <memeDialog v-model="showHotMeme7d" :memeArr="hotMeme7d" :loading="hotMeme7dLoading" :emptyText="loadingTips" @refresh="refreshHotMeme7d">
            <div class="dialog-header">
                <div>七天热门烂梗</div>
                <div><el-button @click="openHotMeme24h">查看近24h热门</el-button></div>
            </div>
        </memeDialog>
        <!-- 搜索结果框 -->
        <memeDialog v-model="showSearchDialog" :memeArr="searchedMeme" :loading="searchDialogLoading" :emptyText="searchEmptyText" @refresh="handleSearchMeme">
            <div class="search-tips">烂梗搜索结果:</div>
        </memeDialog>
    </div>
    <!-- 支持我弹出框 -->
    <el-dialog v-model="supportMeDialog" title="谢谢你" width="1100">
        <img src="http://cdn.dgq63136.icu/zfb.jpg" alt="" width="1000" />
    </el-dialog>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { getHotMeme24h, getHotMeme7d, searchMeme } from '@/apis/getMeme';
import { Search } from '@element-plus/icons-vue';
import memeDialog from './components/meme-dialog.vue';
import { useIsMobile } from '@/utils/common';
import { useRoute } from 'vue-router';
const isMobile = useIsMobile();
const route = useRoute();

const loadingTips = '我还没有加载完喔~~';
const supportMeDialog = ref(false);
// 24h热门烂梗对话框
const showHotMeme24h = ref(false);
const hotMeme24h = ref<Meme[]>([]);
const hotMeme24hLoading = ref(true);
async function refreshHotMeme24h() {
    const memeArr = await getHotMeme24h();
    if (!memeArr) return;
    hotMeme24h.value = memeArr;
    hotMeme24hLoading.value = false;
}
function openHotMeme24h() {
    showHotMeme24h.value = true;
    showHotMeme7d.value = false;
    hotMeme24hLoading.value = true;
    refreshHotMeme24h();
}

// 7天热门烂梗对话框
const showHotMeme7d = ref(false);
const hotMeme7d = ref<Meme[]>([]);
const hotMeme7dLoading = ref(true);
async function refreshHotMeme7d() {
    const memeArr = await getHotMeme7d();
    if (!memeArr) return;
    hotMeme7d.value = memeArr;
    hotMeme7dLoading.value = false;
}
function openHotMeme7d() {
    showHotMeme24h.value = false;
    showHotMeme7d.value = true;
    hotMeme7dLoading.value = true;
    refreshHotMeme7d();
}

// 顶部烂梗热榜，控制其在移动端，非首页的时候不显示
const showHotMeme = computed(() => !(isMobile.value && route.path !== '/home'));

// 顶部栏的单条烂梗轮播展示。因为取用的24h热榜数据，所以先触发一次获取到数据
refreshHotMeme24h();
const rotationIndex = ref(0);
setInterval(() => {
    const length = hotMeme24h.value.length;
    rotationIndex.value = (rotationIndex.value + 1) % length;
}, 5000);

// 搜索
const searchKey = ref('');
const showSearchDialog = ref(false);
const searchedMeme = ref<Meme[]>([]);
const searchDialogLoading = ref(true);
const searchEmptyText = ref(loadingTips);
async function handleSearchMeme() {
    searchDialogLoading.value = true;
    showSearchDialog.value = true;
    searchEmptyText.value = loadingTips;
    const res = await searchMeme(searchKey.value);
    searchDialogLoading.value = false;
    if (!res) {
        searchedMeme.value = [];
        return;
    }
    if (res === 'notfound') {
        searchedMeme.value = [];
        searchEmptyText.value = '没有找到搜索结果。想要补充更多烂梗？请去首页投稿！';
        return;
    }
    searchedMeme.value = res;
}

onMounted(() => {
    // 第一次在一小时后弹出
    setTimeout(() => {
        supportMeDialog.value = true;
        // 后续每次在两小时后弹出
        setInterval(() => {
            supportMeDialog.value = true;
        }, 2 * 60 * 60 * 1000); // 2h
    }, 60 * 60 * 1000); // 1h
});
//上传按钮
const complaintButton = () => {
    window.open('https://www.wjx.cn/vm/rQUgnS0.aspx#');
};

const lightningUrl = 'https://pic.imgdb.cn/item/66992905d9c307b7e9f0136e.png';
const wxurl = 'https://pic.imgdb.cn/item/66dd952dd9c307b7e9321a73.png';
</script>

<style scoped lang="scss">
@media (min-width: 601px) {
    .header {
        .header-content {
            height: 55px;
            width: 100%;
            min-width: 1270px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            .logo-link {
                display: flex;
                margin-left: 10px;
                .logo-img {
                    height: 40px;
                    margin: 5px;
                    border-radius: 5px;
                }
                .header-title {
                    color: #ff552e;
                    font-size: 30px;
                }
            }
            .header-actions {
                display: flex;
                .hot-barrage-img {
                    width: 26px;
                    height: 26px;
                }
                .hot-barrage {
                    cursor: pointer;
                    width: 300px;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    color: #e4d6b8;
                    white-space: nowrap;
                    .hot-barrage-span {
                        color: #e4d6b8;
                        border-bottom: 1px solid #e4d6b8;
                    }
                    .fade-enter-active,
                    .fade-leave-active {
                        transition: opacity 0.5s;
                    }

                    .fade-enter-from,
                    .fade-leave-to {
                        opacity: 0;
                    }
                }
            }

            .elinput {
                width: 180px;
                margin-right: 20px;
                .el-input__wrapper {
                    border-radius: 95px;
                    border: 0;
                    box-shadow: 0 0 0 0px;
                }
            }

            .complaint-button {
                margin-right: 10px;
            }

            .icon-img {
                width: 31px;
                margin-right: 15px;
            }

            .icon-img-rounded {
                width: 31px;
                height: 31px;
                margin-right: 15px;
                border-radius: 5px;
            }
        }
    }
}

@media (max-width: 600px) {
    .hot-barrage-span {
        color: #e4d6b8;
        border-bottom: 1px solid black;
        padding-bottom: 1px;
    }

    .hot-barrage-img {
        position: absolute;
        margin-top: 230px;
        width: 24px;
        height: 24px;
        cursor: pointer;
        margin-right: 10px;
    }

    .logo-link {
        display: none;
    }

    .hot-barrage {
        cursor: pointer;
        width: 300px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        position: absolute;
        margin-top: 230px;
        left: 30px;
        z-index: 1;
        color: black;
    }

    .fade-enter-active,
    .fade-leave-active {
        transition: opacity 0.5s;
    }

    .fade-enter-from,
    .fade-leave-to {
        opacity: 0;
    }

    .elinput {
        margin-left: 20px;
        width: 90vw;

        .el-input__wrapper {
            border-radius: 95px;
            border: 0;
            box-shadow: 0 0 0 0px;
        }
    }

    .icon-img-rounded {
        margin-top: 5px;
        width: 22px;
        height: 20px;
        border-radius: 5px;
        margin-right: 5px;
    }

    .complaint-button {
        width: 80px;
        height: 30px;
        font-size: 11px;
        margin-right: 5px;
    }

    .icon-img {
        margin-top: 5px;
        height: 20px;
        width: 20px;
        margin-right: 5px;
    }

    .header {
        background-color: #fff;
        display: flex;
        align-items: center;
        border-bottom: 1px solid #ddd;
    }
}

.dialog-header {
    display: flex;
    justify-content: space-between;
}

.search-tips {
    font-size: x-large;
}
</style>
