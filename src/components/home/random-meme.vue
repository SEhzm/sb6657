<template>
    <div class="random-meme">
        <div class="random-barrage-header">
            <div class="random-barrage-title">
                <div class="title">随机一条烂梗</div>
                <span class="tips">(直接点击也能复制)</span>
            </div>
            <div class="refresh-controls">
                <span class="refresh-text" @click="handleRefresh">换一换</span>
                <el-icon :class="['refresh-icon', { rotating: isRotating }]" @click="handleRefresh" size="18">
                    <Refresh />
                </el-icon>
            </div>
        </div>
        <div v-if="randomMeme" class="modern-barrage-card" @click="handleCopyMeme(randomMeme)">
            <div class="barrage-main-content">
                <div class="barrage-text-wrapper">
                    <span class="barrage-text">{{ randomMeme.barrage }}</span>
                </div>

                <div class="barrage-meta-info">
                    <div class="tags-container" v-if="getDisplayTags(randomMeme.tags, memeTags).length > 0">
                        <div v-for="(item, index) in getDisplayTags(randomMeme.tags, memeTags)" :key="index" class="modern-tag">
                            <img v-if="item.iconUrl" :src="item.iconUrl" class="tag-icon" />
                            <span class="tag-label">{{ item.label }}</span>
                        </div>
                    </div>
                    <div class="submit-time">
                        <span class="meme-id">#{{ randomMeme.id }}</span>
                        {{ easyFormatTime(randomMeme.submitTime) }}
                    </div>
                </div>
            </div>

            <div class="modern-copy-button" @click.stop="handleCopyMeme(randomMeme)">
                <div class="copy-text">复制</div>
                <div class="copy-icon">📋</div>
                <div class="copy-count">
                    <flipNum :num="randomMeme.cnt || 0" />
                </div>
                <div class="copy-ripple"></div>
            </div>
        </div>
        <div v-else class="no-data">暂无烂梗数据</div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import flipNum from '@/components/flip-num.vue';
import { useMemeTagsStore } from '@/stores/memeTags';
import { getRandomMeme } from '@/apis/getMeme';
import { copyCountPlus1, plus1Error } from '@/apis/setMeme';
import { throttle } from '@/utils/throttle';
import { copyToClipboard, copySuccess, limitedCopy } from '@/utils/clipboard';
import { easyFormatTime } from '@/utils/time';
import type { getMemeList_meme } from '@/types/meme';
import type { getMemeTags as memeTag } from '@/types/meme';
import { getDisplayTags } from '@/utils/tags';

const memeTagsStore = useMemeTagsStore();
const memeTags = ref<memeTag[]>([]);
memeTagsStore.tagsLoaded.then(() => {
    memeTags.value = memeTagsStore.memeTags;
});
const randomMeme = ref<getMemeList_meme>();
const loading = ref(false);
const isRotating = ref(false);

// 数据获取
async function getRandomOne(): Promise<boolean> {
    const { _failure, flatData } = await getRandomMeme();
    if (_failure || !flatData) {
        console.error('获取随机烂梗失败');
        return false;
    }
    randomMeme.value = flatData;
    return true;
}
getRandomOne();

// 新的刷新处理函数，包含旋转动画
const handleRefresh = async () => {
    if (loading.value) return;
    isRotating.value = true;
    loading.value = true;

    const success = await getRandomOne();
    if (!success) {
        console.error('获取随机烂梗失败');
        loading.value = false;
        return;
    }
    loading.value = false;

    // 旋转动画持续600ms
    setTimeout(() => {
        isRotating.value = false;
    }, 600);
};

// 节流过的复制，2s内多次点击复制只取其中一次发请求给后台
const copyMeme = throttle(copyToClipboard, limitedCopy, 2000);
async function handleCopyMeme(meme: getMemeList_meme) {
    const copyResult = copyMeme(meme.barrage);
    if (!copyResult || copyResult === 'limitedSuccess') return;
    copySuccess();

    try {
        const success = await copyCountPlus1('', meme.id);
        if (success) {
            // 更新本地复制计数
            randomMeme.value!.cnt = `${+randomMeme.value!.cnt + 1}`;
        } else {
            plus1Error();
        }
    } catch (error) {
        console.error('更新复制计数失败:', error);
        plus1Error();
    }
}
</script>
<style scoped lang="scss">
.random-meme {
    .random-barrage-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 8px;

        .random-barrage-title {
            display: flex;
            flex-wrap: wrap;
            .title {
                font-size: 24px;
                font-weight: 600;
                color: #303133;
            }
            .tips {
                font-size: small;
                color: #909399;
                font-style: italic;
            }
        }

        .refresh-controls {
            display: flex;
            align-items: center;
        }

        .refresh-text {
            font-size: 18px;
            color: #409eff;
            cursor: pointer;
            text-wrap: nowrap;

            &:hover {
                color: #66b1ff;
            }
        }

        .refresh-icon {
            color: #409eff;
            cursor: pointer;
            transition: all 0.3s ease;

            &:hover {
                color: #66b1ff;
            }

            &.rotating {
                animation: rotate 0.6s linear;
            }
        }
    }

    .modern-barrage-card {
        display: flex;
        align-items: center;
        gap: 12px;

        .barrage-main-content {
            flex: 1;
            cursor: pointer;
            transition: all 0.3s ease;

            &:hover {
                .barrage-text {
                    color: #11a983;
                }
            }
        }

        .barrage-text-wrapper {
            margin-bottom: 12px;
        }

        .barrage-text {
            font-family: 'Microsoft YaHei', '微软雅黑', sans-serif;
            font-size: large;
            color: #303133;
            line-height: 1.6;
            word-break: break-all;
            transition: color 0.3s ease;
        }

        .barrage-meta-info {
            display: flex;
            flex-direction: column;
            gap: 8px;
        }

        .tags-container {
            display: flex;
            flex-wrap: wrap;
            gap: 6px;
        }

        .modern-tag {
            display: inline-flex;
            align-items: center;
            gap: 3px;
            background: #e7f6f3;
            border: none;
            border-radius: 50px;
            padding: 4px 6px;
            font-size: 14px;
            color: #18a985;

            .tag-icon {
                width: 22px;
                height: 22px;
                object-fit: cover;
            }
        }

        .submit-time {
            font-size: 12px;
            color: #909399;

            .meme-id {
                font-size: 16px;
                color: gray;
                padding-right: 4px;
                font-weight: 600;
                font-style: italic;
            }
        }

        .modern-copy-button {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            padding: 6px 12px;
            background: #11a983;
            border-radius: 6px;
            cursor: pointer;
            transition: all 0.3s ease;
            border: none;
            white-space: nowrap;
            flex-shrink: 0;

            &:hover {
                background: #0e8a6b;
                transform: translateY(-1px);
                box-shadow: 0 4px 8px rgba(17, 169, 131, 0.3);
            }

            &:active {
                transform: translateY(0);
            }

            .copy-icon {
                font-size: 16px;
                color: #ffffff;
                margin-right: 4px;
            }

            .copy-text {
                font-size: 14px;
                font-weight: 500;
                color: #ffffff;
                margin-right: 4px;
            }

            .copy-count {
                font-size: 14px;
                font-weight: 600;
                color: #ffffff;
                overflow: hidden;
                height: 1.2em;
                line-height: 1.2em;
            }
        }
    }

    // 响应式设计
    @media (max-width: 768px) {
        .modern-barrage-card {
            flex-direction: column;
            gap: 12px;
            padding: 10px 0;
            .barrage-main-content {
                width: 100%;
            }

            .barrage-text {
                font-size: 15px;
            }

            .modern-copy-button {
                align-self: flex-start;
                padding: 5px 10px;

                .copy-icon {
                    font-size: 14px;
                }

                .copy-text {
                    font-size: 13px;
                }

                .copy-count {
                    font-size: 13px;
                    overflow: hidden;
                    height: 1.2em;
                    line-height: 1.2em;
                }
            }

            .modern-tag {
                padding: 3px 6px;
                font-size: 12px;
                color: #18a985;

                .tag-icon {
                    width: 20px;
                    height: 20px;
                }
            }
        }
    }

    .no-data {
        text-align: center;
        color: #909399;
        font-size: 14px;
        padding: 32px;
        background-color: #f8f9fa;
        border-radius: 8px;
        border: 1px dashed #dcdfe6;
    }
}
</style>
