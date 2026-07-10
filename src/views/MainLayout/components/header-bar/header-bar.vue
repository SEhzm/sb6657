<template>
    <div class="header">
        <div class="header-content">
            <div class="logo-link">
                <a href="https://www.douyu.com/6657" target="_blank">
                    <img src="/favicon.ico" alt="大🐖头" class="logo-img" />
                    <p class="header-title">斗鱼玩机器烂梗库</p>
                </a>
                <div class="elinput-mobile">
                    <el-input v-model="enteringSearchKey" type="search" placeholder="输入以搜索烂梗..." clearable
                        @keyup.enter="handleSearchMemeOnEnter">
                        <template #append>
                            <el-button type="primary" @click="handleSearchMeme">
                                <el-icon>
                                    <Search />
                                </el-icon>
                            </el-button>
                        </template>
                    </el-input>
                </div>
                <button class="submit-entry submit-entry-mobile" type="button" @click="openSubmissionDialog">投稿</button>
            </div>

            <div class="header-actions">
                <img v-if="showHotMeme" src="@/assets/imgs/hot.png" alt="热门" class="hot-barrage-img"
                    @click="openHotMeme24h" />
                <div v-if="showHotMeme" @click="openHotMeme24h" class="hot-barrage">
                    <transition name="fade">
                        <span :key="rotationIndex" class="hot-barrage-span">热门：{{ hotMeme24h?.[rotationIndex]?.content
                            || ''
                        }}</span>
                    </transition>
                </div>

                <div class="elinput">
                    <el-input v-model="enteringSearchKey" type="search" placeholder="输入以搜索烂梗..." clearable
                        @keyup.enter="handleSearchMemeOnEnter">
                        <template #append>
                            <el-button type="primary" @click="handleSearchMeme">
                                <el-icon>
                                    <Search />
                                </el-icon>
                            </el-button>
                        </template>
                    </el-input>
                </div>
                <button class="submit-entry submit-entry-desktop" type="button" @click="openSubmissionDialog">投稿</button>
                <el-button type="primary" @click="complaintButton" class="complaint-button">
                    上传照片
                    <br />
                    建议/提交BUG
                </el-button>
                <el-tooltip effect="light" v-model:visible="shangwuVisible" placement="right-end"
                    popper-style="margin-bottom: 0;">
                    <img src="@/assets/imgs/mail.png" alt="heihei" class="icon-container icon-img" />
                    <template #content>
                        接计算机类毕设(论文)，程序设计，<br />课设，广告，商务，<br />
                        联系邮箱:he20020928@foxmail.com
                    </template>
                </el-tooltip>
                <!-- <a class="icon-container" href="https://sb6657.cn/Tampermonkey">
                    <img src="https://pic.imgdb.cn/item/6704f830d29ded1a8c738f70.png" alt="油猴" class="icon-img" />
                </a> -->
                <a class="icon-container" href="https://yuba.douyu.com/feed/2639094748291342931" target="_blank">
                    <img src="@/assets/imgs/douyu.png" alt="douyu" class="icon-img" />
                </a>
                <a class="icon-container" href="https://github.com/SEhzm/sb6657/" target="_blank">
                    <img src="@/assets/imgs/github.png" alt="github" class="icon-img" />
                </a>

                <el-tooltip v-model:visible="supportVisible" placement="left" effect="light">
                    <el-image class="icon-container icon-img" :src="lightningUrl" fit="cover"
                        @click="supportMeDialog = true" />
                    <template #content>
                        如果你喜欢这个网站<br />可以点我进行赞赏或GitHub点个star~
                    </template>
                </el-tooltip>
                <el-dropdown trigger="hover">
                    <div class="user-message">
                        <div class="message-icon">
                            <img src="@/assets/icons/msg.svg" alt="msg" />
                            <div>消息</div>
                        </div>
                        <span class="unread-badge">{{ totalUnreadMessages || '0' }}</span>
                    </div>
                    <template #dropdown>
                        <el-dropdown-menu>
                            <router-link to="/me-msg">
                                <el-dropdown-item>评论 ({{ commentNum }})</el-dropdown-item>
                                <el-dropdown-item>赞和表态 ({{ likeAndStatementNum }})</el-dropdown-item>
                            </router-link>
                        </el-dropdown-menu>
                    </template>
                </el-dropdown>

                <div class="icon-img">
                    <userHome />
                </div>

                <!-- <el-button class="GuangGaoHead" plain @click="openAd">
                    <span>小孔CSGO陪玩</span>
                </el-button> -->
            </div>
            <el-dialog v-model="AdDialog" title="小孔CSGO陪玩" :width="adWidth" :append-to-body="true">
                <img style="width: 80vw; "
                    src="https://cdn.hguofichp.cn/%E5%B0%8F%E5%AD%94%E5%B9%BF%E5%91%8A_compressed.png" alt="">
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
        <!-- 投稿弹窗 -->
        <submission-dialog v-model="submissionDialogVisible" />
        <!-- 支持我弹出框 -->
        <el-dialog v-model="supportMeDialog" title="谢谢老板~" :width="lightWidth">
            <img src="https://cdn.hguofichp.cn/zfb.jpg" alt="" width="100%" />
        </el-dialog>

        <!-- 首页广告信息弹出框 -->
        <!-- <el-dialog v-model="adInfoDialog" title="甲方要求150人注册。 ありがとう米娜桑" :width="lightWidth">
            <a href="https://yousheng186.com/activity/login/1?promotionCode=6657" target="_blank">
                <p>感谢甲方爸爸继续支持我们，各位爹注册一下吧，凑凑人头吧，祝你们长生不老永远不死。</p>
                <img src="https://pic1.imgdb.cn/item/6a25768ed71dee7c941a8d6c.jpg" alt="广告图片"
                    style="width: 100%; margin-top: 10px;" />
            </a>
        </el-dialog> -->
    </div>
</template>

<script setup lang="ts">
import { getHotMeme24h, getHotMeme7d } from '@/apis/getMeme';
import httpInstance from '@/apis/httpInstance';
import submissionDialog from '@/components/submission-dialog.vue';
import { useIsMobile } from '@/utils/common';
import { Search } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';
import { computed, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import memeDialog from './components/meme-dialog.vue';
import userHome from './components/userHome.vue';

const isMobile = useIsMobile();
const route = useRoute();
const router = useRouter();
const SEARCH_QUERY_KEY = 'search';

const loadingTips = '我还没有加载完喔~~';
const supportMeDialog = ref(false);
const adInfoDialog = ref(false);
// 24h热门烂梗对话框
const showHotMeme24h = ref(false);
const hotMeme24h = ref<Meme[]>([]);
const hotMeme24hLoading = ref(true);
const supportVisible = ref(true);
const shangwuVisible = ref(false);
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
const enteringSearchKey = ref('');
const submissionDialogVisible = ref(false);

function handleSearchMeme() {
    const nextSearchKey = enteringSearchKey.value.trim();
    if (nextSearchKey === '') {
        ElMessage.warning('请输入搜索内容');
        return;
    }

    router.push({
        query: {
            ...route.query,
            [SEARCH_QUERY_KEY]: nextSearchKey,
        },
    });
}

function handleSearchMemeOnEnter(event: KeyboardEvent) {
    event.preventDefault();
    event.stopPropagation();
    handleSearchMeme();
    (event.target as HTMLInputElement)?.blur();
}

function openSubmissionDialog() {
    submissionDialogVisible.value = true;
}

const lightningUrl = 'https://cdn.hguofichp.cn/power.png';
const lightWidth = computed(() => (isMobile.value ? '100%' : '35%'));
const adWidth = computed(() => (isMobile.value ? '90%' : '35%'));

// 消息数量
const likeAndStatementNum = ref(0);
const commentNum = ref(0);
const totalUnreadMessages = computed(() => {
    return likeAndStatementNum.value + commentNum.value;
});
const readFlag = ref(false);
async function fetchMsgNum() {
    try {
        const res: any = await httpInstance.get('/machine/SysMessage/getMsgNum');
        if (res.code === 200 && res.data) {
            likeAndStatementNum.value = res.data.likeAndStatementNum;
            commentNum.value = res.data.commentNum;
            readFlag.value = res.data.readFlag;
        } else {
            likeAndStatementNum.value = 0;
            commentNum.value = 0;
            readFlag.value = false;
        }
    } catch (error) {
        console.error('获取消息数量失败:', error);
    }
}

onMounted(() => {
    fetchMsgNum();
    setInterval(() => {
        fetchMsgNum();
    }, 30 * 60 * 1000); // 30min

    //第一次在15min后弹出赞助码对话框
    setTimeout(() => {
        supportMeDialog.value = true;
        // 后续每次在15min后弹出
        setInterval(() => {
            supportMeDialog.value = true;
        }, 15 * 60 * 1000); // 15min
    }, 15 * 60 * 1000); // 15min  15 * 60 * 1000

    //第一次在10min后弹出广告信息对话框
    setTimeout(() => {
        adInfoDialog.value = true;
        // 后续每次在20min后弹出
        setInterval(() => {
            adInfoDialog.value = true;
        }, 20 * 60 * 1000); // 20min
    }, 10 * 60 * 1000); // 10min

    setTimeout(() => {
        supportVisible.value = false;
        shangwuVisible.value = true;
    }, 2000);
    setTimeout(() => {
        shangwuVisible.value = false;
    }, 5000);
});
//上传按钮
const complaintButton = () => {
    window.open('https://www.wjx.cn/vm/rQUgnS0.aspx#');
};

const AdDialog = ref(false);

function openAd() {
    AdDialog.value = !AdDialog.value;
}
</script>

<style scoped lang="scss">
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
        gap: 10px;
        justify-content: space-between;

        .logo-link {
            height: 100%;
            display: flex;
            align-items: center;
            margin-left: 10px;

            &>a {
                display: flex;
            }

            .logo-img {
                height: 40px;
                margin-right: 6px;
                border-radius: 5px;
            }

            .header-title {
                width: 250px;
                color: #ff552e;
                font-size: 30px;
            }

            .elinput-mobile {
                display: none;
            }
        }

        .header-actions {
            height: 100%;
            display: flex;
            align-items: center;
            position: relative;

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

            .elinput {
                width: 180px;
                margin-right: 20px;
            }

            .complaint-button {
                margin-right: 10px;
                padding-left: 4px;
                padding-right: 4px;
            }

            .submit-entry-desktop {
                margin-right: 10px;
                align-self: flex-start;
                height: 52px;
                min-width: 70px;
                border-radius: 0 0 10px 10px;
                font-size: 18px;
                font-weight: 700;
                box-shadow: 0 4px 12px rgba(251, 114, 153, 0.26);
            }

            .icon-container {
                cursor: pointer;
                height: 32px;
                margin-right: 15px;
            }

            .icon-img {
                height: 32px;
                object-fit: contain;
            }

            .user-message {
                height: 32px;
                margin-right: 15px;
                position: relative;
                cursor: pointer;

                .message-icon {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    font-size: 12px;
                    color: #e3d5b8ff;

                    img {
                        height: 28px;
                    }
                }

                .unread-badge {
                    position: absolute;
                    top: -3px;
                    right: -4px;
                    background-color: red;
                    color: white;
                    border-radius: 50%;
                    width: 16px;
                    height: 16px;
                    font-size: 12px;
                    text-align: center;
                    line-height: 12px;
                    font-weight: bold;
                }
            }

            .GuangGaoHead {
                display: none;
            }
        }
    }

    .submit-entry {
        height: 38px;
        min-width: 72px;
        border: 0;
        border-radius: 8px;
        background: #fb7299;
        color: #fff;
        font-size: 16px;
        font-weight: 600;
        line-height: 1;
        letter-spacing: 1px;
        box-shadow: 0 2px 8px rgba(251, 114, 153, 0.22);
        cursor: pointer;
        transition: transform 0.2s, background 0.2s, box-shadow 0.2s;

        &:hover {
            background: #ff85ad;
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(251, 114, 153, 0.28);
        }

        &:active {
            transform: translateY(0);
            box-shadow: 0 1px 5px rgba(251, 114, 153, 0.2);
        }
    }

    .submit-entry-mobile {
        display: none;
    }

    .dialog-header {
        display: flex;
        justify-content: space-between;
    }
}

// 移动端样式
@media (max-width: 600px) {
    .header {
        background-color: #fff;
        position: relative;
        z-index: 1;

        .header-content {
            padding-top: 6px;
            height: auto;
            display: flex;
            flex-wrap: wrap;

            .logo-link {
                height: 100%;
                display: flex;
                gap: 8px;
                align-items: center;
                margin-left: 10px;
                width: calc(100% - 20px);

                .header-title {
                    display: none;
                }

                .elinput-mobile {
                    display: block;
                    flex: 1;
                    min-width: 0;
                    margin-right: 0;
                }

                .submit-entry-mobile {
                    display: block;
                    flex-shrink: 0;
                    width: 56px;
                    min-width: 56px;
                    height: 32px;
                    font-size: 14px;
                }
            }

            .header-actions {
                height: auto;
                width: 100%;
                justify-content: space-around;

                .hot-barrage-img {
                    position: absolute;
                    top: 200px;
                    left: 4px;
                    width: 24px;
                    height: 24px;
                    cursor: pointer;
                }

                .hot-barrage {
                    cursor: pointer;
                    width: 360px;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    position: absolute;
                    top: 200px;
                    left: 30px;
                    z-index: 1;
                }

                .elinput {
                    display: none;
                }

                .complaint-button {
                    margin-right: 0;
                }

                .submit-entry-desktop {
                    display: none;
                }

                .icon-container {
                    height: 24px;
                    margin-right: 0;
                }

                .icon-img {
                    height: 24px;
                }

                .user-message {
                    height: auto;
                    margin-right: 0;

                    .message-icon {
                        font-size: 10px;

                        img {
                            height: 20px;
                        }
                    }

                    .unread-badge {
                        top: -2px;
                        right: -3px;
                        width: 14px;
                        height: 14px;
                        font-size: 10px;
                        line-height: 14px;
                    }
                }

                .GuangGaoHead {
                    display: inline-flex;
                    font-size: 11px;
                    padding: 0 4px;
                    color: #000;
                }
            }
        }
    }
}
</style>
