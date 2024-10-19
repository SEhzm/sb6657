<template>
    <div class="header">
        <div style="flex: 1">
            <div class="header-content">
                <a href="https://www.douyu.com/6657" target="_blank" class="logo-link">
                    <img src="/public/favicon.ico" alt="大狗头" class="logo-img" />
                    <p class="header-title">斗鱼玩机器烂梗收集</p>
                </a>

                <div class="header-actions">
                    <img src="@/assets/imgs/hot.png" alt="热门" style="width: 24px; height: 24px; cursor: pointer; margin-right: 10px" class="hotBarrageImg" @click="openHotMeme24h" />
                    <div @click="openHotMeme24h" class="hotBarrage" style="cursor: pointer; width: 300px; overflow: hidden; text-overflow: ellipsis; color: #e4d6b8; white-space: nowrap">
                        <transition name="fade">
                            <span :key="rotationIndex" class="hotBarrageSpan">热门：{{ hotMeme24h?.[rotationIndex]?.content || '' }}</span>
                        </transition>
                    </div>

                    <div style="margin-right: 20px" class="elinput">
                        <el-input v-model="searchQuery" placeholder="搜索烂梗" clearable style="" @input="onSearchQueryChange">
                            <template #append>
                                <el-button type="primary" @click="queryBarrage">
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
                    <a href="https://gitee.com/hzming1/sb6657" target="_blank">
                        <img src="@/assets/imgs/gitee.png" alt="gitee" class="icon-img" />
                    </a>
                    <a href="https://yuba.douyu.com/feed/2639094748291342931" target="_blank">
                        <img src="@/assets/imgs/douyu.png" alt="douyu" class="icon-img" />
                    </a>
                    <a href="https://github.com/SEhzm/sb6657/" target="_blank">
                        <img src="@/assets/imgs/github.png" alt="github" class="icon-img" />
                    </a>
                    <el-image id="myDiv" class="icon-img-rounded" :src="url" :hide-on-click-modal="true" :zoom-rate="1.2" :max-scale="7" lazy :min-scale="0.2" :preview-src-list="['http://cdn.dgq63136.icu/zfb.jpg']" :initial-index="4" fit="cover" />
                    <el-image class="icon-img-rounded" :src="wxurl" :hide-on-click-modal="true" :zoom-rate="1.2" lazy :max-scale="7" :min-scale="0.2" :preview-src-list="['http://cdn.dgq63136.icu/wx.jpg']" :initial-index="4" fit="cover" />
                </div>
            </div>

            <div class="QueryTable" v-if="isInput">
                <el-button class="close-button" @click="closeQueryTable">
                    <svg t="1725098483582" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4538" width="16" height="16">
                        <path d="M0 0h1024v1024H0z" fill="#FF0033" fill-opacity="0" p-id="4539"></path>
                        <path
                            d="M240.448 168l2.346667 2.154667 289.92 289.941333 279.253333-279.253333a42.666667 42.666667 0 0 1 62.506667 58.026666l-2.133334 2.346667-279.296 279.210667 279.274667 279.253333a42.666667 42.666667 0 0 1-58.005333 62.528l-2.346667-2.176-279.253333-279.253333-289.92 289.962666a42.666667 42.666667 0 0 1-62.506667-58.005333l2.154667-2.346667 289.941333-289.962666-289.92-289.92a42.666667 42.666667 0 0 1 57.984-62.506667z"
                            fill="#111111"
                            p-id="4540"
                        ></path>
                    </svg>
                </el-button>
                <el-table v-loading="loading" :data="data.filteredItems" stripe @row-click="copySearchMeme" style="cursor: pointer" empty-text="可能没有这条烂梗或请手动刷新页面">
                    <el-table-column prop="barrage" label="弹幕"></el-table-column>
                    <el-table-column label align="center" width="85">
                        <el-button type="primary">复制</el-button>
                    </el-table-column>
                </el-table>
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
    </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import httpInstance from '@/apis/httpInstance';
import { throttle } from '@/utils/throttle';
import { copyToClipboard, copySuccess, limitedCopy } from '@/utils/clipboard';
import { copyCountPlus1, plus1Error } from '@/apis/setMeme';
import { getHotMeme24h, getHotMeme7d } from '@/apis/getMeme';
import memeDialog from './components/meme-dialog.vue';

const loadingTips = '我还没有加载完喔~~';
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

// 顶部栏的单条烂梗轮播展示。因为取用的24h热榜数据，所以先触发一次获取到数据
refreshHotMeme24h();
const rotationIndex = ref(0);
setInterval(() => {
    const length = hotMeme24h.value.length;
    rotationIndex.value = (rotationIndex.value + 1) % length;
}, 5000);

const loading = ref(true);
const searchQuery = ref('');
const isInput = ref(false);
const data = reactive({
    filteredItems: [],
    tableData: [],
    table: '',
    barrage: '',
    hotBarrageOf10: [],
    hotBarrageOf7day: [],
});

//搜索
const queryBarrage = () => {
    console.log(searchQuery.value);
    httpInstance
        .post('/machine/Query', {
            QueryBarrage: searchQuery.value,
        })
        .then((res) => {
            console.log(res);
            isInput.value = true;
            loading.value = false;
            data.filteredItems = res.data || [];
        });
};

// 2s节流。节流期间触发了就调第二个回调
const copyText = throttle(copyToClipboard, limitedCopy, 2000);

async function copySearchMeme(row: { barrage: string; id: string }) {
    console.log('搜索', row);
    const memeText = row.barrage;
    /**
     * 三种返回值情况
     * 1. false，代表错误了，用户没能正确复制到剪贴板
     *    由第一个回调函数copyToClipboard里自行捕获到错误并且出弹窗提醒
     * 2. 'limitedSuccess'，表示byd在连续点击，被节流函数制裁了
     *    由第二个回调函数limitedCopy里出弹窗提醒
     * 3. true，这是正常复制，自行处理，这里出个弹窗提醒并且向后端发请求让复制次数+1
     */
    const res = copyText(memeText);
    if (!res || res === 'limitedSuccess') return;
    copySuccess();
    if (await copyCountPlus1('allbarrage', row.id)) {
        return;
    }
    plus1Error();
}

//定时一小时弹出支持我！！！
setTimeout(function () {
    const myDiv = document.getElementById('myDiv');
    if (myDiv) {
        const e = document.createEvent('MouseEvents');
        e.initEvent('click', true, true);
        myDiv.dispatchEvent(e);
    }
}, 60 * 60 * 1000); // 一小时
//上传按钮
const complaintButton = () => {
    window.open('https://www.wjx.cn/vm/rQUgnS0.aspx#');
};
const onSearchQueryChange = () => {
    data.filteredItems = [];
    isInput.value = false;
};

const closeQueryTable = () => {
    searchQuery.value = '';
    isInput.value = false;
};

const url = 'https://pic.imgdb.cn/item/66992905d9c307b7e9f0136e.png';
const wxurl = 'https://pic.imgdb.cn/item/66dd952dd9c307b7e9321a73.png';
</script>

<style scoped lang="scss">
.close-button {
    position: absolute;
    top: 5px;
    right: 5px;
    z-index: 10;
    border: none;
}

@media (min-width: 601px) {
    .el-dialog {
        --el-dialog-width: 50%;
    }

    .fade-enter-active,
    .fade-leave-active {
        transition: opacity 0.5s;
    }

    .fade-enter-from,
    .fade-leave-to {
        opacity: 0;
    }

    .hotBarrageSpan {
        color: #e4d6b8;
        border-bottom: 1px solid #e4d6b8;
        padding-bottom: 1px;
    }

    .QueryTable {
        padding: 20px;
        z-index: 100;
        position: absolute;
        width: 500px;
        background-color: white;
        border-radius: 10px;
        right: 265px;
        box-shadow: 0px 0px 35px rgb(37, 19, 19);
    }

    .elinput {
        .el-input__wrapper {
            border-radius: 95px;
            border: 0;
            box-shadow: 0 0 0 0px;
        }
    }

    .header {
        height: 55px;
        display: flex;
        align-items: center;
        width: 100%;
        z-index: 1000;
    }

    .header-content {
        padding-left: 20px;
        display: flex;
        align-items: center;
    }

    .logo-link {
        display: block;
        width: 370px;
        height: 50px;
    }

    .logo-img {
        height: 40px;
        float: left;
        margin: 5px;
        border-radius: 5px;
    }

    .header-title {
        color: #ff552e;
        font-size: 30px;
        align-items: center;
    }

    .header-actions {
        display: flex;
        justify-content: flex-end;
        margin-left: auto;
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

@media (max-width: 600px) {
    .hotBarrageSpan {
        color: black;
        border-bottom: 1px solid black;
        padding-bottom: 1px;
    }

    .el-overlay-dialog {
        z-index: 3;
    }

    .hotBarrageImg {
        position: absolute;
        margin-top: 230px;
    }

    .logo-link {
        display: none;
    }

    .hotBarrage {
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

    .QueryTable {
        padding: 20px;
        z-index: 1000;
        position: absolute;
        width: 100%;
        background-color: white;
        border-radius: 10px;
        right: 0px;
        box-shadow: 0px 0px 35px rgb(37, 19, 19);
    }

    .eldtable {
        width: 100% !important;
    }

    .elinput {
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
</style>
