<template>
    <div class="memes-view">
        <div class="card-table">
            <div class="card" v-if="route.path === '/memes/AllBarrage'">
                <h4>
                    按标签查看烂梗
                    <el-popover :width="300">
                        <template #reference>
                            <el-icon size="16">
                                <Warning />
                            </el-icon>
                        </template>
                        为解决烂梗分栏不足和分类不清晰问题。
                        <br />
                        <b>点击标签即可添加</b>
                    </el-popover>
                    <el-button link type="success" style="margin-left: 50%">
                        投稿标签
                        <el-popover :width="300">
                            <template #reference>
                                <el-icon size="16">
                                    <QuestionFilled />
                                </el-icon>
                            </template>
                            <b>功能待完善(后续更新将添加)，请在上方(建议/提交)问卷投稿，sry。</b>
                            <br />
                            <b>审核巨严格，(重复，相似等)将不通过</b>
                        </el-popover>
                    </el-button>
                </h4>
                <tag-selector v-model:selectedTags="selectedTags" :tags="allTags" />
            </div>
            <div class="top">
                <div class="submit-tips">想要补充更多烂梗？点击这里投稿→</div>
                <el-button type="primary" @click="handleSubmit">烂梗投稿</el-button>
                <el-button v-if="route.path === '/memes/AllBarrage'" class="btn-animate btn-animate__ball-collision"
                    color="#66CCFF" @click="sortMeme(1)">按复制次数排序</el-button>
            </div>

            <el-table class="main-table" :data="memeArr" stripe v-loading="loading" cell-class-name="hover-pointer"
                empty-text="该标签组合为空，期待投稿！" @row-click="copyMeme_countPlus1">
                <el-table-column align="center" width="60">
                    <template #default="scope">
                        <el-tag round effect="plain">{{ scope.row.id }}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="content">
                    <template #default="scope">
                        <el-popover placement="top" :width="'auto'" trigger="hover" :visible="scope.row.popoverVisible">
                            <template #reference>
                                <div style="cursor: pointer" @touchstart="handleTouchStart(scope.row)"
                                    @touchend="handleTouchEnd(scope.row)">
                                    <el-icon v-if="hasShieldWordInContent(scope.row.content)" style="color: #e6a23c; flex-shrink: 0;" size="large">
                                        <WarningFilled />
                                    </el-icon>
                                    <span class="barrage-text">{{ scope.row.content }}</span>
                                </div>
                            </template>
                            <template #default>
                                <div style="display: flex; align-items: center; flex-wrap: wrap">
                                    <div v-for="(item, index) in getDisplayTags(scope.row.tags, allTags)" :key="index"
                                        style="margin-right: 8px">
                                        <el-tag round effect="dark" :style="{ fontSize: '16px', cursor: 'pointer' }">
                                            <div class="tag-icon-wrapper">
                                                <img v-if="item.iconUrl" :src="item.iconUrl"
                                                    style="height: 22px; object-fit: cover; vertical-align: middle" />
                                                <span style="vertical-align: middle">{{ item.label }}</span>
                                            </div>
                                        </el-tag>
                                    </div>
                                    <!-- 屏蔽词提示 - 用小字显示在tag区域 -->
                                    <span v-if="hasShieldWordInContent(scope.row.content)"
                                        style="font-size: 14px; color: #e6a23c; margin-left: 4px;">
                                        <el-icon style="margin-right: 2px; vertical-align: middle;">
                                            <Warning />
                                        </el-icon>
                                        包含屏蔽词
                                    </span>
                                    <span
                                        style="position: absolute; bottom: 0; right: 0; font-size: 11px; min-width: 170px">投稿时间:
                                        {{ easyFormatTime(scope.row.submitTime) }}</span>
                                </div>
                            </template>
                        </el-popover>
                    </template>
                </el-table-column>
                <!-- <el-table-column align="center" width="40">
                    <template #default="scope">
                        <LikeNum :likeCount="scope.row.likes" @click.stop="likeMeme_countPlus1(scope.row)"/>
                    </template>
                </el-table-column> -->
                <el-table-column align="center" width="100">
                    <template #default="scope">
                        <el-button type="primary" class="copy-btn" @click.stop="copyMeme_countPlus1(scope.row)">
                            复制 🌈
                            <flip-num :num="scope.row.copyCount" />
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination-wrapper">
                <el-pagination v-if="!loading" background layout="prev, pager, next, jumper" :current-page="currentPage"
                    :total="total" :pager-count="5" :page-size="pageSize"
                    @current-change="handlePageChange"></el-pagination>
            </div>
        </div>

        <submission-dialog v-model="dialogFormVisible"></submission-dialog>
        <el-backtop :right="50" :bottom="50">UP</el-backtop>
    </div>
</template>

<script setup lang="ts">
import { getMemeList } from '@/apis/getMeme';
import httpInstance from '@/apis/httpInstance';
import { copyCountPlus1, plus1Error } from '@/apis/setMeme';
import flipNum from '@/components/flip-num.vue';
import submissionDialog from '@/components/submission-dialog.vue';
import tagSelector from '@/components/tag-selector.vue';
import { API, MemeCategory } from '@/constants/backend';
import { useMemeTagsStore } from '@/stores/memeTags';
import { useShieldWordStore } from '@/stores/shieldWordStore';
import { type getMemeTags as memeTag } from '@/types/meme';
import { copySuccess, copyToClipboard, limitedCopy, limitedLike } from '@/utils/clipboard';
import { getDisplayTags } from '@/utils/tags';
import { throttle } from '@/utils/throttle';
import { easyFormatTime } from '@/utils/time';
import { Warning } from '@element-plus/icons-vue';
import { computed, onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
const memeTagsStore = useMemeTagsStore();
const shieldWordStore = useShieldWordStore();

//初始化屏蔽词数据
onMounted(async () => {
    try {
        //如果屏蔽词数据为空，尝试加载
        if (shieldWordStore.shieldWords.length === 0) {
            await shieldWordStore.setShieldWords();
        }
    } catch (error) {
        console.error('加载屏蔽词失败:', error);
    }
});

const route = useRoute();
const router = useRouter();
/**
 * currentCategory可能为空，代表没匹配到路由对应分类。
 * 不过正常情况路由只有点击tab能改变，这时候都是能匹配到的，出现空只可能是用户自己瞎几把改url。
 * 所以我采取的方法是匹配不到就定位到404页。建议后面用currentCategory的地方都这么处理
 */
const currentCategory = computed(() => {
    selectedTags.value = [];
    return MemeCategory.find((item) => item.path === route.path);
});

const loading = ref(true);
const memeArr = ref<Meme[]>([]);

const allTags = ref<memeTag[]>([]);
memeTagsStore.tagsLoaded.then(() => {
    allTags.value = memeTagsStore.memeTags;
});
const selectedTags = ref<memeTag[]>([]);
const selectedTagsStr = computed(() => selectedTags.value.map((t) => t.dictValue).join(','));
watch(
    () => selectedTagsStr.value,
    () => {
        refreshMeme(1);
    }
);

/**
 * 排序功能
 */
const isSort = ref(false);
async function sortMeme(pageNum: number) {
    try {
        const res = await httpInstance.get(API.GET_SORTED_ALL_MEME, {
            params: {
                pageNum: pageNum,
                pageSize: pageSize,
                tags: selectedTagsStr.value,
            },
        });
        isSort.value = true;
        memeArr.value = res.data.list.map((item: any) => ({
            total: item.total,
            content: item.barrage,
            id: item.id,
            copyCount: +item.cnt,
            tags: item.tags,
            submitTime: item.submitTime,
        }));
    } catch (err) {
        console.error('排序失败:', err);
        memeArr.value = [];
    }
}
watch(
    () => route.path,
    () => {
        console.log('当前页面path:', route.path);
        isSort.value = false;
        currentPage.value = 1;
        loading.value = true;
        refreshMeme(1);
    }
);

// 分页
const pageSize = 50;
const currentPage = ref(1);
const total = ref(0);
function handlePageChange(page: number) {
    currentPage.value = page;
    scrollToTop();
    if (isSort.value == false) {
        refreshMeme(page);
    } else {
        sortMeme(page);
    }
}

async function refreshMeme(pageNum: number) {
    const category = currentCategory.value?.category;
    if (!category) {
        router.push('/404');
        return;
    }
    const res = await getMemeList(category, pageNum, pageSize, selectedTagsStr.value || undefined);

    //没有就是没有数据
    if (!res) {
        memeArr.value = [];
        return;
    }

    memeArr.value = res.memeArr;

    total.value = res.total;
    loading.value = false;
}
refreshMeme(1);

// 复制
// 2s节流。节流期间触发了就调第二个回调。表示2s内多次点击复制只取其中一次发请求给后台
const copyMeme = throttle(copyToClipboard, limitedCopy, 2000);
//like复用copy
const likeMeme = throttle(copyToClipboard, limitedLike, 2000);
async function copyMeme_countPlus1(meme: Meme) {
    const memeText = meme.content;
    const res = copyMeme(memeText);
    if (!res || res === 'limitedSuccess') return;
    copySuccess();
    if (isSort.value == true) {
        if (await copyCountPlus1('allbarrage', meme.id, currentPage.value, pageSize, 'desc')) {
            await sortMeme(currentPage.value);
            return;
        }
    } else {
        if (await copyCountPlus1(meme.category || 'allbarrage', meme.id, currentPage.value, pageSize)) {
            await refreshMeme(currentPage.value);
            return;
        }
    }
    plus1Error();
}

// 弹出投稿弹窗按钮
const dialogFormVisible = ref(false);
function handleSubmit() {
    dialogFormVisible.value = true;
}

//移动端的触摸展示
function handleTouchStart(row: any) {
    row.touchStartTime = Date.now();
}
function handleTouchEnd(row: any) {
    const touchEndTime = Date.now();
    if (touchEndTime - row.touchStartTime > 100) {
        //100ms 长按时长
        row.popoverVisible = true;
        setTimeout(() => {
            row.popoverVisible = false;
        }, 1500);
    }
}

// 检查内容是否包含屏蔽词
function hasShieldWordInContent(content: string): boolean {
    if (!content || !shieldWordStore.shieldWords || shieldWordStore.shieldWords.length === 0) {
        return false;
    }
    return shieldWordStore.hasShieldWord(content);
}

// 回顶部
const scrollToTop = () => {
    window.scrollTo({
        // top: document.documentElement.offsetHeight, //回到底部
        top: 0, //回到顶部
        behavior: 'smooth', //smooth 平滑；auto:瞬间
    });
};
</script>

<style scoped lang="scss">
.memes-view {
    width: 93%;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;

    .card-table {
        width: 100%;
        max-width: 1400px;

        .card {
            border-radius: 5px 5px 0 0;
        }

        .top {
            display: flex;
            align-items: center;
            padding-top: 10px;
            padding-left: 10px;
            gap: 6px;
            background-color: #fff;

            .submit-tips {
                font-size: small;
                font-weight: bold;
            }

            .btn-animate {
                margin: 0;
                font-size: 16px;
                border: none;
                border-radius: 5px;
                background: #027efb;
                color: #fff;
                text-align: center;
            }

            @keyframes crissCrossLeft {
                0% {
                    left: -20px;
                }

                50% {
                    left: 50%;
                    width: 20px;
                    height: 20px;
                }

                100% {
                    left: 50%;
                    width: 375px;
                    height: 375px;
                }
            }

            @keyframes crissCrossRight {
                0% {
                    right: -20px;
                }

                50% {
                    right: 50%;
                    width: 20px;
                    height: 20px;
                }

                100% {
                    right: 50%;
                    width: 375px;
                    height: 375px;
                }
            }

            .btn-animate__ball-collision {
                position: relative;
                overflow: hidden;
                z-index: 1;

                &::before,
                &::after {
                    content: '';
                    position: absolute;
                    top: 50%;
                    width: 20px;
                    height: 20px;
                    background-color: #90cf5b;
                    border-radius: 50%;
                    opacity: 0.5;
                    transition: all 0.6s;
                    z-index: -1;
                }

                &::before {
                    left: -20px;
                    transform: translate(-50%, -50%);
                }

                &::after {
                    right: -20px;
                    transform: translate(50%, -50%);
                }

                &:hover {
                    &::before {
                        opacity: 1;
                        animation: crissCrossLeft 0.8s both;
                    }

                    &::after {
                        opacity: 1;
                        animation: crissCrossRight 0.8s both;
                    }
                }
            }
        }

        :deep(.dialog-main) {
            width: 95%;
        }

        :deep(.hover-pointer) {
            cursor: pointer;
        }

        .index {
            font-size: large;
        }

        .copy-btn {
            width: 90px;
        }

        .pagination-wrapper {
            display: flex;
            justify-content: center;
            margin-top: 16px;
            margin-bottom: 40px;
        }
    }
}

@media (min-width: 600px) {
    .main-table {
        font-size: large;
    }
}

@media (max-width: 601px) {
    .memes-view {
        width: 100%;
    }

    .main-table {
        font-size: medium;
    }
}

.tag-icon-wrapper {
    height: 100%;
    width: 100%;
    display: flex;
    align-items: center;
}
</style>
