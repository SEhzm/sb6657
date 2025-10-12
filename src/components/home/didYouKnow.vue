<template>
    <div class="did-you-know">
        <h3>🤔 你知道吗？</h3>
        <ul class="knowledge-list">
            <li>
                谁目前打出了对位donk最多的击杀? 谁又是对位donk最大的受害者?
                <RouterLink to="/15warriorsDonk">- 布雷德15勇士</RouterLink>
            </li>
            <li>
                哪只队伍捕虾最专业? 谁是最佳捕虾人? 又是谁在捕虾过程中惨遭反夹?
                <RouterLink to="/dejaVuNiko">- 超级逮虾户战报</RouterLink>
            </li>
            <el-divider />
            <li class="latest-meme">
                <div class="line-top">
                    <span class="total">
                        共有
                        <span class="total-count">{{ lastMeme.total }}</span>
                        条烂梗
                    </span>
                    <span class="submit-time">最后投稿时间：{{ lastMeme.time }}</span>
                </div>
                <div class="line-bottom">
                    <span class="label">最新投稿烂梗：</span>
                    <span class="copy-hint">(点击可复制)</span>
                    <ElTooltip :trigger="isMobile ? 'click' : 'hover'" placement="top" effect="light">
                        <template #content>
                            <div class="tooltip-content">
                                <div class="tags-container" v-if="lastMeme.tags && lastMeme.tags.length">
                                    <div v-for="(item, index) in lastMeme.tags" :key="index" class="modern-tag">
                                        <img v-if="item.iconUrl" :src="item.iconUrl" class="tag-icon" />
                                        <span class="tag-label">{{ item.label }}</span>
                                    </div>
                                </div>
                                <div class="copy-count">复制次数：{{ lastMeme.copy }}</div>
                            </div>
                        </template>
                        <span class="meme-text" :class="{ clicked: isClicked }" @click="handleCopyLatestMeme">{{ lastMeme.meme }}</span>
                    </ElTooltip>
                </div>
            </li>
        </ul>
    </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';
import { RouterLink } from 'vue-router';
import { getMemeList } from '@/apis/getMeme';
import { easyFormatTime } from '@/utils/time';
import { useMemeTagsStore } from '@/stores/memeTags';
import type { getMemeTags as memeTag } from '@/types/meme';
import { useIsMobile } from '@/utils/common';
import { getDisplayTags } from '@/utils/tags';
import { ElTooltip, ElNotification, ElDivider } from 'element-plus';
import { copyToClipboard } from '@/utils/clipboard';

const isMobile = useIsMobile();
const memeTagsStore = useMemeTagsStore();
const memeTags = ref<memeTag[]>([]);
memeTagsStore.tagsLoaded.then(() => {
    memeTags.value = memeTagsStore.memeTags;
});

const lastMeme = reactive({
    time: '',
    meme: '',
    tags: [{ label: '', iconUrl: '' }],
    copy: 0,
    total: 0,
});
async function getLastMeme() {
    const res = await getMemeList('allbarrage', 1, 1);
    if (!res) return;
    lastMeme.time = easyFormatTime(res.memeArr[0].submitTime);
    lastMeme.meme = res.memeArr[0].content;
    lastMeme.tags = getDisplayTags(res.memeArr[0].tags, memeTags.value);
    lastMeme.copy = res.memeArr[0].copyCount;
    lastMeme.total = res.total;
}
getLastMeme();

const isClicked = ref(false);
function handleCopyLatestMeme() {
    if (!lastMeme.meme) return;
    copyToClipboard(lastMeme.meme);
    ElNotification({
        message: '复制成功',
        type: 'success',
    });
    isClicked.value = true;
    setTimeout(() => {
        isClicked.value = false;
    }, 1200);
}
</script>

<style scoped lang="scss">
.did-you-know {
    h3 {
        margin: 0 0 12px 0;
        font-size: 18px;
        color: #303133;
        font-weight: 600;
    }

    .knowledge-list {
        list-style: none;
        padding: 0;
        margin: 0;

        li {
            margin-bottom: 8px;
            font-size: 14px;
            line-height: 1.6;
            color: #606266;

            &:last-child {
                margin-bottom: 0;
            }

            a {
                color: #409eff;
                text-decoration: none;
                font-weight: 500;
                text-wrap: nowrap;

                &:hover {
                    text-decoration: underline;
                    color: #66b1ff;
                }
            }
        }
    }
}
.latest-meme {
    display: flex;
    flex-direction: column;
    gap: 4px;
    font-size: 13px;

    .line-top {
        display: inline-flex;
        gap: 8px;
        align-items: baseline;
        text-wrap: nowrap;

        .total {
            color: #606266;
            font-weight: 600;
            .total-count {
                color: cadetblue;
            }
        }

        .submit-time {
            color: #909399;
            font-size: x-small;
        }
    }

    .line-bottom {
        display: inline-flex;
        flex-wrap: wrap;
        align-items: baseline;
        gap: 6px;
    }

    .label {
        font-weight: 600;
        color: #303133;
    }
    .copy-hint {
        color: #909399;
        font-size: 12px;
        font-style: italic;
    }

    .meme-text {
        color: #303133;
        cursor: pointer;
        text-decoration: underline;
        text-decoration-style: dashed;
        text-underline-offset: 2px;

        &:hover {
            color: #409eff;
        }

        &.clicked {
            color: #409eff;
        }
    }
}

.tooltip-content {
    max-width: 480px;
    .tags-container {
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
        margin-bottom: 6px;
    }
    .modern-tag {
        display: inline-flex;
        align-items: center;
        gap: 3px;
        background: #e7f6f3;
        border: none;
        border-radius: 50px;
        padding: 3px 6px;
        font-size: 12px;
        color: #18a985;

        .tag-icon {
            width: 22px;
            height: 22px;
            object-fit: contain; // 完整显示图片，不裁剪
        }
    }
    .copy-count {
        font-size: 12px;
        color: #606266;
    }
}

@media (max-width: 768px) {
    .latest-meme {
        font-size: 12px;
    }
}
</style>
