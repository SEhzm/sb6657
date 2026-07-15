<template>
    <div class="home-info-modules">
        <section class="info-module" aria-labelledby="knowledge-title">
            <h3 id="knowledge-title">🤔 你知道吗？</h3>
            <ul class="module-list">
                <li>
                    谁目前打出了对位donk最多的击杀? 谁又是对位donk最大的受害者?
                    <RouterLink to="/15warriorsDonk">- 布雷德15勇士</RouterLink>
                </li>
                <!-- 超级逮虾户作者停更较久，首页推荐入口暂时下线，恢复时取消注释即可。
                <li>
                    哪只队伍捕虾最专业? 谁是最佳捕虾人? 又是谁在捕虾过程中惨遭反夹?
                    <RouterLink to="/dejaVuNiko">- 超级逮虾户战报</RouterLink>
                </li>
                -->
                <li>
                    一年一度的sb6657野榜top20烂梗在这里
                    <RouterLink to="/memeTop20">- 年度TOP20烂梗</RouterLink>
                </li>
            </ul>
        </section>

        <el-divider class="module-divider" />

        <section class="info-module" aria-labelledby="time-machine-title">
            <h3 id="time-machine-title">sb6657时光机</h3>
            <p>万恶之源，我们的来时路。旧版 sb6657.cn 考古专项</p>
            <nav class="module-links" aria-label="sb6657 历史版本">
                <a href="https://wishao.fun/v1.sb6657.cn/" target="_blank" rel="noopener noreferrer">sb6657.cn v1</a>
                <a href="https://wishao.fun/v2.sb6657.cn/" target="_blank" rel="noopener noreferrer">sb6657.cn v2</a>
            </nav>
        </section>

        <el-divider class="module-divider" />

        <section class="info-module">
            <div class="latest-meme">
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
                                <div v-if="lastMeme.tags && lastMeme.tags.length" class="tags-container">
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
            </div>
        </section>
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
.home-info-modules {
    .info-module {
        color: #606266;
        font-size: 14px;
        line-height: 1.6;

        h3 {
            margin: 0 0 12px;
            color: #303133;
            font-size: 18px;
            font-weight: 600;
        }

        a {
            color: #409eff;
            font-weight: 500;
            text-decoration: none;
            text-wrap: nowrap;

            &:hover {
                color: #66b1ff;
                text-decoration: underline;
            }
        }
    }

    .module-list {
        list-style: none;
        margin: 0;
        padding: 0;

        li {
            margin-bottom: 8px;

            &:last-child {
                margin-bottom: 0;
            }
        }
    }

    .module-links {
        display: flex;
        flex-wrap: wrap;
        gap: 4px 16px;
        margin-top: 4px;
    }

    :deep(.module-divider) {
        margin: 8px 0;
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
