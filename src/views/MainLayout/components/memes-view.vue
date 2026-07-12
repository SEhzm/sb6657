<template>
    <div class="memes-view">
        <div class="card-table">
            <div class="card">
                <h4 class="tag-card-title">
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
                    <el-button class="tag-submit-btn" link type="success">
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
                <el-button type="primary" @click="submissionDialogStore.open">烂梗投稿</el-button>
                <el-button class="btn-animate btn-animate__ball-collision" color="#66CCFF" @click="sortMeme(1)">按复制次数排序</el-button>
            </div>

            <el-table class="main-table" :data="memeArr" stripe v-loading="loading" cell-class-name="hover-pointer" empty-text="该标签组合为空，期待投稿！" @row-click="copyMeme_countPlus1">
                <el-table-column align="center" width="60">
                    <template #default="scope">
                        <el-tag round effect="plain">{{ scope.row.id }}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="content">
                    <template #default="scope">
                        <el-popover placement="top" :width="'auto'" trigger="hover" :visible="scope.row.popoverVisible">
                            <template #reference>
                                <div class="meme-content" @touchstart="handleTouchStart(scope.row)" @touchend="handleTouchEnd(scope.row)">
                                    <el-icon v-if="hasShieldWordInContent(scope.row.content)" class="shield-warning-icon" size="large">
                                        <WarningFilled />
                                    </el-icon>
                                    <span class="barrage-text">{{ scope.row.content }}</span>
                                </div>
                            </template>
                            <template #default>
                                <div class="meme-popover">
                                    <div class="tags-container">
                                        <div v-for="item in getDisplayTags(scope.row.tags, allTags)" :key="item.label" class="popover-tag">
                                            <el-tag round effect="dark" class="tag-item">
                                                <div class="tag-icon-wrapper">
                                                    <img v-if="item.iconUrl" :src="item.iconUrl" class="tag-icon" />
                                                    <span class="tag-label">{{ item.label }}</span>
                                                </div>
                                            </el-tag>
                                        </div>
                                    </div>
                                    <!-- 屏蔽词提示 - 用小字显示在tag区域 -->
                                    <span v-if="hasShieldWordInContent(scope.row.content)" class="shield-word-text">
                                        <el-icon class="shield-word-icon">
                                            <Warning />
                                        </el-icon>
                                        包含屏蔽词
                                    </span>
                                    <div class="submit-time">投稿时间:{{ easyFormatTime(scope.row.submitTime) }}</div>
                                </div>
                            </template>
                        </el-popover>
                    </template>
                </el-table-column>
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
                <el-pagination v-if="!loading" background layout="prev, pager, next, jumper" :size="isMobile ? 'small' : ''" :current-page="currentPage" :total="total" :pager-count="isMobile ? 4 : 5" :page-size="pageSize" @current-change="handlePageChange"></el-pagination>
            </div>
        </div>

        <el-backtop :right="50" :bottom="50">UP</el-backtop>
    </div>
</template>

<script setup lang="ts">
import { getMemeList } from '@/apis/getMeme';
import httpInstance from '@/apis/httpInstance';
import { copyCountPlus1, plus1Error } from '@/apis/setMeme';
import flipNum from '@/components/flip-num.vue';
import tagSelector from '@/components/tag-selector.vue';
import { API } from '@/constants/backend';
import { useMemeTagsStore } from '@/stores/memeTags';
import { useShieldWordStore } from '@/stores/shieldWordStore';
import { useSubmissionDialogStore } from '@/stores/useSubmissionDialogStore';
import { type getMemeTags as memeTag } from '@/types/meme';
import { copySuccess, copyToClipboard, limitedCopy } from '@/utils/clipboard';
import { getDisplayTags } from '@/utils/tags';
import { throttle } from '@/utils/throttle';
import { easyFormatTime } from '@/utils/time';
import { QuestionFilled, Warning, WarningFilled } from '@element-plus/icons-vue';
import { computed, onMounted, ref, watch } from 'vue';
import { useIsMobile } from '@/utils/common';

const memeTagsStore = useMemeTagsStore();
const shieldWordStore = useShieldWordStore();
const submissionDialogStore = useSubmissionDialogStore();
const memeCategory = 'allbarrage';
const isMobile = useIsMobile();

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
    const res = await getMemeList(memeCategory, pageNum, pageSize, selectedTagsStr.value || undefined);

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
async function copyMeme_countPlus1(meme: Meme) {
    const memeText = meme.content;
    const res = copyMeme(memeText);
    if (!res || res === 'limitedSuccess') return;
    copySuccess();
    if (isSort.value == true) {
        if (await copyCountPlus1(memeCategory, meme.id, currentPage.value, pageSize, 'desc')) {
            await sortMeme(currentPage.value);
            return;
        }
    } else {
        if (await copyCountPlus1(meme.category || memeCategory, meme.id, currentPage.value, pageSize)) {
            await refreshMeme(currentPage.value);
            return;
        }
    }
    plus1Error();
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

            .tag-card-title {
                display: flex;
                align-items: center;
                flex-wrap: wrap;
                gap: 4px;

                .tag-submit-btn {
                    margin-left: auto;
                }
            }
        }

        .top {
            display: flex;
            align-items: center;
            flex-wrap: wrap;
            gap: 6px;
            padding-top: 10px;
            padding-left: 10px;
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

        .main-table {
            .meme-content {
                display: flex;
                align-items: center;
                gap: 4px;
                cursor: pointer;

                .shield-warning-icon {
                    flex-shrink: 0;
                    color: #e6a23c;
                }

                .barrage-text {
                    min-width: 0;
                    overflow-wrap: anywhere;
                }
            }

            :deep(.hover-pointer) {
                cursor: pointer;
            }

            .copy-btn {
                width: 90px;
            }
        }

        .pagination-wrapper {
            display: flex;
            justify-content: center;
            margin-top: 16px;
            margin-bottom: 40px;
        }
    }
}

.meme-popover {
    .tags-container {
        display: inline-flex;
        align-items: center;
        flex-wrap: wrap;
        gap: 8px;

        .popover-tag {
            display: flex;

            .tag-item {
                font-size: 16px;
                cursor: pointer;

                .tag-icon-wrapper {
                    width: 100%;
                    height: 100%;
                    display: flex;
                    align-items: center;
                    gap: 4px;
                }

                .tag-icon {
                    height: 22px;
                    object-fit: cover;
                    vertical-align: middle;
                }

                .tag-label {
                    vertical-align: middle;
                }
            }
        }
    }

    .shield-word-text {
        display: inline-flex;
        align-items: center;
        margin-left: 4px;
        font-size: 14px;
        color: #e6a23c;

        .shield-word-icon {
            margin-right: 2px;
        }
    }

    .submit-time {
        font-size: 11px;
    }
}

@media (min-width: 600px) {
    .memes-view {
        .main-table {
            font-size: large;
        }
    }
}

@media (max-width: 601px) {
    .memes-view {
        width: 100%;

        .tag-card-title {
            .tag-submit-btn {
                margin-left: 0;
            }
        }

        .main-table {
            font-size: medium;
        }
    }
}
</style>
