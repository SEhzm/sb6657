<template>
    <div class="header">
        <div class="header-content">
            <a href="https://www.douyu.com/6657" target="_blank" class="logo-link">
                <img src="/public/favicon.ico" alt="大🐖头" class="logo-img" />
                <p class="header-title">斗鱼玩机器烂梗库</p>
            </a>

            <div class="header-actions">
                <img v-if="showHotMeme" src="@/assets/imgs/hot.png" alt="热门" class="hot-barrage-img"
                    @click="openHotMeme24h" />
                <div v-if="showHotMeme" @click="openHotMeme24h" class="hot-barrage">
                    <transition name="fade">
                        <span :key="rotationIndex" class="hot-barrage-span">热门：{{ hotMeme24h?.[rotationIndex]?.content
                            || '' }}</span>
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
                <el-tooltip class="box-item" effect="light" content="接程序设计，广告，商务，详情联系邮箱 he20020928@foxmail.com"
                    placement="bottom">
                    <img src="@/assets/imgs/mail.png" alt="heihei" class="icon-img" />
                </el-tooltip>
                <a href="https://sb6657.cn/#/Tampermonkey">
                    <img src="https://pic.imgdb.cn/item/6704f830d29ded1a8c738f70.png" alt="油猴" class="icon-img" />
                </a>
                <a href="https://yuba.douyu.com/feed/2639094748291342931" target="_blank">
                    <img src="@/assets/imgs/douyu.png" alt="douyu" class="icon-img" />
                </a>
                <a href="https://github.com/SEhzm/sb6657/" target="_blank">
                    <img src="@/assets/imgs/github.png" alt="github" class="icon-img" />
                </a>

                <el-image class="icon-img-rounded" :src="lightningUrl" :hide-on-click-modal="true" :zoom-rate="1.2"
                    :max-scale="7" lazy :min-scale="0.2" :preview-src-list="['http://cdn.hguofichp.cn/zfb.jpg']"
                    :initial-index="4" fit="cover" />


                <el-dropdown trigger="hover">
                    <div style="display: flex; font-size: 12px; height: 25px; color: #e3d5b8ff; position: relative;">
                        <span>
                            <img src="@/assets/icons/msg.svg" alt="msg" class="icon-img" />
                            <span v-if="totalUnreadMessages > 0" class="unread-badge">{{ totalUnreadMessages }}</span>
                            <span v-else-if="totalUnreadMessages === 0" class="unread-badge">0</span>
                            <br>消息
                        </span>
                    </div>
                    <template #dropdown>
                        <el-dropdown-menu>
                            <router-link to="/me-msg">
                                <el-dropdown-item>
                                    评论 ({{ commentNum }})
                                </el-dropdown-item>
                                <el-dropdown-item>
                                    赞和表态 ({{ likeAndStatementNum }})
                                </el-dropdown-item>
                            </router-link>
                        </el-dropdown-menu>
                    </template>
                </el-dropdown>


                <userHome style="margin-left:20px;" class="icon-img"></userHome>
                <!-- <el-button class="GuangGaoHead" plain @click="openAd"><span>玩小将自己的<br>陪玩店🏪</span></el-button> -->

            </div>
            <el-dialog v-model="AdDialog" title="玩小将自己的陪玩店🏪" width="100%">
                <h2>店长5年观龄玩神脑残粉</h2>
                <h4>女陪玩全部视频验证保真 <b style="color: red;">+v：weifucsgo</b></h4>
                <h4>男陪玩最低1.3rating魔王S <b style="color: red;">女客服：J34-126</b></h4>
                <h4>纯绿色，店长线下见过所有陪玩</h4>
            </el-dialog>

        </div>

        <!-- 24h热门弹幕对话框 -->
        <memeDialog v-model="showHotMeme24h" :memeArr="hotMeme24h" :loading="hotMeme24hLoading" :emptyText="loadingTips"
            @refresh="refreshHotMeme24h">
            <div class="dialog-header">
                <div>24h热门烂梗</div>
                <div><el-button @click="openHotMeme7d">查看近七天热门</el-button></div>
            </div>
        </memeDialog>
        <!-- 7天热门弹幕对话框 -->
        <memeDialog v-model="showHotMeme7d" :memeArr="hotMeme7d" :loading="hotMeme7dLoading" :emptyText="loadingTips"
            @refresh="refreshHotMeme7d">
            <div class="dialog-header">
                <div>七天热门烂梗</div>
                <div><el-button @click="openHotMeme24h">查看近24h热门</el-button></div>
            </div>
        </memeDialog>
        <!-- 搜索结果框 -->
        <memeDialog v-model="showSearchDialog" :memeArr="searchedMeme" :loading="searchDialogLoading"
            :emptyText="searchEmptyText" @refresh="handleSearchMeme">
            <div class="search-tips">烂梗搜索结果:</div>
        </memeDialog>
    </div>
    <!-- 支持我弹出框 -->
    <el-dialog v-model="supportMeDialog" title="谢谢你" :width=lightWidth>
        <img src="http://cdn.hguofichp.cn/zfb.jpg" alt="" width='100%' />
    </el-dialog>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { getHotMeme24h, getHotMeme7d, searchMeme } from '@/apis/getMeme';
import { Search } from '@element-plus/icons-vue';
import memeDialog from './components/meme-dialog.vue';
import userHome from './components/userHome.vue';
import { useIsMobile } from '@/utils/common';
import { useRoute } from 'vue-router';
import httpInstance from '@/apis/httpInstance';
import { isRelogin } from '@/apis/httpInstance';
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
        searchEmptyText.value = "请输入搜索词..."
        return;
    }
    if (res === 'notfound') {
        searchedMeme.value = [];
        searchEmptyText.value = '没有找到搜索结果。想要补充更多烂梗？请去首页投稿！';
        return;
    }
    searchedMeme.value = res;
}
const lightningUrl = 'https://cdn.hguofichp.cn/power.png';
let lightWidth = '75%'

// 消息数量
const likeAndStatementNum = ref(0);
const commentNum = ref(0);
const totalUnreadMessages = computed(() => {
    return likeAndStatementNum.value + commentNum.value;
});
const readFlag = ref(false);
async function fetchMsgNum() {
    try {
        const res = await httpInstance.get('/machine/SysMessage/getMsgNum');
        if (res.code === 200) {
            likeAndStatementNum.value = res.data.likeAndStatementNum;
            commentNum.value = res.data.commentNum;
            readFlag.value = res.data.readFlag;
        }
    } catch (error) {
        console.error('获取消息数量失败:', error);
    }
}

onMounted(() => {

    if (isRelogin.show) {
        fetchMsgNum();
        setInterval(() => {
            fetchMsgNum();
        }, 10 * 60 * 1000); // 10min
    }


    if (isMobile.value) {
        lightWidth = '100%';
    }

    // 第一次在一小时后弹出
    // setTimeout(() => {
    //     supportMeDialog.value = true;
    //     // 后续每次在两小时后弹出
    //     setInterval(() => {
    //         supportMeDialog.value = true;
    //     }, 2 * 60 * 60 * 1000); // 2h
    // }, 60 * 60 * 1000); // 1h
});
//上传按钮
const complaintButton = () => {
    window.open('https://www.wjx.cn/vm/rQUgnS0.aspx#');
};

const AdDialog = ref(false)

function openAd() {
    AdDialog.value = !AdDialog.value
}
</script>

<style scoped lang="scss">
@media (min-width: 601px) {
    .header {
        z-index: 1000;
        top: 0;
        position: sticky;

        .header-content {
            backdrop-filter: saturate(100%) blur(4px);
            height: 55px;
            width: 100%;
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
                    width: 300px;
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

                .GuangGaoHead {
                    display: none;
                }

                .unread-badge {
                    position: absolute;
                    bottom: -20px;
                    right: 0px;
                    background-color: red;
                    color: white;
                    border-radius: 50%;
                    width: 18px;
                    height: 18px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 13px;
                    font-weight: bold;
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
                width: 32px;
                margin-right: 15px;
            }

            .icon-img-rounded {
                width: 31px;
                height: 31px;
                margin-right: 15px;
                border-radius: 5px;
            }

            ::v-deep .el-image-viewer__wrapper {
                position: fixed;
                height: 100vh;
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

    .GuangGaoHead {
        width: 90px;
        font-size: 11px;
        padding: 0px;
        color: #000;
    }

    .unread-badge {
        position: absolute;
        bottom: 0px;
        right: -5px;
        background-color: red;
        color: white;
        border-radius: 50%;
        width: 13px;
        height: 13px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 13px;
        font-weight: bold;
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
