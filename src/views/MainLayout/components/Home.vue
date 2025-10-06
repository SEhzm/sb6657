<template xmlns="http://www.w3.org/1999/html">
    <div class="home">
        <div class="boom">
            <img src="https://gcore.jsdelivr.net/gh/9WiSHao/AnythingStorage/img/6657boom.webp" alt="6657boom" class="boom6657" />
        </div>
        <div class="cards-container">
            <div class="card first-card">
                <HomeIntro />
            </div>
            <div class="card second-card">
                <DidYouKnow />
            </div>
        </div>
        <div class="card third-card">
            <RandomMeme />
        </div>
        <div class="card fifth-card">
            <div>
                <span>
                    可选标签
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
                    <el-button link type="success" class="submit-tag-button">
                        投稿标签
                        <el-popover :width="300">
                            <template #reference>
                                <el-icon size="16">
                                    <QuestionFilled />
                                </el-icon>
                            </template>
                            <b>请在上方(建议/提交)问卷投稿。</b>
                            <br />
                        </el-popover>
                    </el-button>
                </span>

                <div class="preset-tags-container">
                    <div class="preset-tags">
                        <el-tag round v-for="(tag, index) in presetTags" :key="index" closable @close="removeTagFromPreset(tag)" @click="removeTagFromPreset(tag)" class="preset-tag" type="primary">
                            <div class="tag-icon-wrapper">
                                <img v-if="tag.iconUrl" :src="tag.iconUrl" class="tag-icon" />
                                <span class="tag-text">{{ tag.label }}</span>
                            </div>
                        </el-tag>
                    </div>
                </div>

                <!-- 已添加标签 -->
                <span>
                    已选标签
                    <el-popover :width="250">
                        <template #reference>
                            <el-icon size="16">
                                <Warning />
                            </el-icon>
                        </template>
                        <b>最少一个标签，最多五个标签。</b>
                    </el-popover>
                </span>

                <div class="added-tags">
                    <el-tag round v-for="(tag, index) in addedTags" :key="index" closable @click="removeTag(tag)" @close="removeTag(tag)" class="added-tag" effect="dark">
                        {{ tag.label }}
                    </el-tag>
                </div>
                <el-input v-model="barrage" maxlength="255" autocomplete="off" :autosize="{ minRows: 2, maxRows: 4 }" show-word-limit type="textarea" placeholder=" 烂梗...."></el-input>

                <!-- 新增的关联赛事库部分 -->
                <div class="match-association-container">
                    <div class="match-section-home">
                        <el-checkbox v-model="isMatchSelected" :disabled="!matchData" class="match-checkbox-home">
                            关联赛事库
                            <el-icon color="#3db302ff" size="16">
                                <QuestionFilled />
                            </el-icon>
                        </el-checkbox>
                        <div v-if="matchData" class="match-details-box-home">
                            <div class="match-info-row-home">
                                <img :src="matchData.matchesImg" class="match-image-home" :alt="matchData.matchesName" />
                                <span class="match-name-home">{{ matchData.matchesName }}</span>
                            </div>
                            <div class="match-time-home">{{ matchData.startTime }} 至 {{ matchData.endTime }}</div>
                        </div>
                        <div v-else class="no-match-info-home">当前无正在进行的大型赛事</div>
                        <el-button class="saveBnt" type="primary" @click="saveBarrage">投稿</el-button>
                    </div>
                </div>
            </div>
            <el-backtop :right="50" :bottom="50" />
        </div>
        <ChatRoom class="ChatRoom card"></ChatRoom>
        <div class="card sixth-card">
            友情链接
            <a href="https://dgq63136.cn" target="_blank">dgq63136.cn</a>
            &nbsp;&nbsp;&nbsp;
            <a href="https://sb6657.cn/#/Starrysky" target="_blank">星空背景</a>
        </div>
        <div class="wordCloudDiv">
            <span class="word-cloud-title">
                搜索词云
                <el-icon size="20" class="word-cloud-refresh-icon" @click="refreshWordCloud()">
                    <Refresh />
                </el-icon>
            </span>
            <Suspense>
                <template #default>
                    <WordCloud ref="wordCloudRef" />
                </template>
                <template #fallback>
                    <div class="word-cloud-loading">词云加载中...</div>
                </template>
            </Suspense>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, defineAsyncComponent } from 'vue';
import httpInstance from '@/apis/httpInstance';
import { ElNotification } from 'element-plus';
import { Refresh, Warning, QuestionFilled } from '@element-plus/icons-vue';
import ChatRoom from '@/components/ChatRoom.vue';
import { API } from '@/constants/backend';
import { useMemeTagsStore } from '@/stores/memeTags';
import RandomMeme from '@/components/home/random-meme.vue';
import HomeIntro from '@/components/home/homeIntro.vue';
import DidYouKnow from '@/components/home/didyouknow.vue';

const memeTagsStore = useMemeTagsStore();

memeTagsStore.tagsLoaded.then(() => {
    presetTags.value = memeTagsStore.memeTags.map((item) => ({
        iconUrl: item.iconUrl,
        label: item.dictLabel,
        value: item.dictValue,
    }));
});

const barrage = ref('');
// 所有预设标签
const presetTags = ref([]);

// 已添加投稿标签
const addedTags = ref([]);

// 已添加的投稿标签数组
const addedDictValues = ref([]);

const matchData = ref(null);
const isMatchSelected = ref(false);

function getInProgressMatch() {
    httpInstance
        .get('/machine/InProgressMatch')
        .then((res) => {
            if (res.code === 200 && res.data) {
                matchData.value = res.data;
            } else {
                matchData.value = null;
            }
            console.log('Fetched match data:', matchData.value);
        })
        .catch((err) => {
            console.error('Failed to fetch in progress match:', err);
            matchData.value = null;
        });
}

onMounted(() => {
    getInProgressMatch();
});

// 删除已添加投稿标签
const removeTag = (tag) => {
    addedTags.value = addedTags.value.filter((t) => t.value !== tag.value);
    addedDictValues.value = addedDictValues.value.filter((value) => value !== tag.value);
    presetTags.value.push(tag);
};

// 添加投稿标签的点击事件
const removeTagFromPreset = (tag) => {
    if (addedDictValues.value.length >= 5) {
        ElNotification.info('最多5个标签');
        return;
    }
    // 当删除预设标签时，将其移到已添加标签
    if (!addedTags.value.some((t) => t.value === tag.value)) {
        addedTags.value.push(tag);
        addedDictValues.value.push(tag.value);
        presetTags.value = presetTags.value.filter((t) => t.value !== tag.value);
    }
};

const saveBarrage = () => {
    if (addedDictValues.value.length === 0 || barrage.value === '' || barrage.value === null) {
        ElNotification.error('请选择标签或输入弹幕');
    } else {
        if (addedDictValues.value.length > 5) {
            ElNotification.error('最少一个标签，最多五个标签。');
            return;
        }
        const submitData = {
            tags: addedDictValues.value.join(','),
            barrage: barrage.value,
        };

        if (isMatchSelected.value && matchData.value) {
            submitData.matchId = matchData.value.id;
        }

        httpInstance
            .post(API.SUBMIT_MEME, submitData)
            .then((res) => {
                barrage.value = '';
                isMatchSelected.value = false; // Reset checkbox after submission
                if (res.code === 200) {
                    ElNotification.success('投稿成功，待审核(一天内)');
                } else if (res.code === 500) {
                    ElNotification.error('烂梗已经有了，勿重复提交');
                } else {
                    ElNotification.error('请求失败');
                }
            })
            .catch((err) => {
                console.error('投稿失败', err);
                ElNotification.error('请求失败');
            });
    }
};

const wordCloudRef = ref(null);
// 懒加载 wordCloud 组件
const WordCloud = defineAsyncComponent(() => import('@/components/wordCloud.vue'));
function refreshWordCloud() {
    wordCloudRef.value?.getData?.();
}
</script>

<style scoped lang="scss">
// ===== 主容器样式 =====
.home {
    width: 80%;
    display: flex;
    flex-direction: column;
    align-items: center;

    // 顶部横幅区域
    .boom {
        height: 150px;

        .boom6657 {
            height: 100%;
            border-radius: 10px;
        }
    }

    // 卡片容器
    .cards-container {
        width: 100%;
        display: flex;
        gap: 8px;
        margin-top: 10px;
    }

    // 卡片通用样式
    .card {
        width: 100%;
        line-height: 25px;

        &.first-card,
        &.second-card {
            flex: 1; // 让两个卡片平分宽度
            margin-top: 0; // 重置margin，由容器控制间距
        }

        &.third-card {
            margin-top: 8px;
            padding: 12px;
        }

        &.fifth-card {
            margin-top: 8px;

            // 投稿标签按钮
            .submit-tag-button {
                margin-left: 50%;
            }

            // 预设标签容器
            .preset-tags-container {
                max-height: 75px;
                overflow-y: auto;
                margin-top: 10px;
                margin-bottom: 20px;

                .preset-tags {
                    display: flex;
                    flex-wrap: wrap;

                    .el-tag {
                        position: relative;
                        margin-right: 10px;
                        margin-bottom: 10px;
                    }

                    :deep(.el-tag__close) {
                        font-size: 30px;
                        transform: rotate(45deg);
                    }
                }
            }

            // 预设标签样式
            .preset-tag {
                padding: 15px;
                cursor: pointer;
                font-size: 16px;
            }

            // 已添加标签容器
            .added-tags {
                display: flex;
                flex-wrap: wrap;

                .el-tag {
                    margin-right: 10px;
                    margin-bottom: 10px;
                }
            }

            // 已添加标签样式
            .added-tag {
                padding: 15px;
                cursor: pointer;
                font-size: 16px;
            }

            // 标签图标包装器
            .tag-icon-wrapper {
                .tag-icon {
                    width: 22px;
                    height: 22px;
                    object-fit: cover;
                    vertical-align: middle;
                }

                .tag-text {
                    vertical-align: middle;
                }
            }

            // 赛事关联容器
            .match-association-container {
                display: flex;
                align-items: center;
                width: 100%;
                background-color: #f5f7fa;
                padding: 12px;
                border-radius: 4px;
                margin-top: 10px;
                box-sizing: border-box;

                .match-section-home {
                    display: flex;
                    align-items: center;
                    flex: 1;
                    flex-wrap: wrap;
                    gap: 10px;

                    .match-checkbox-home {
                        margin-right: 10px;
                        white-space: nowrap;
                    }

                    .match-details-box-home {
                        display: flex;
                        flex-direction: column;
                        background-color: #e6f5f2ff;
                        padding: 5px 10px;
                        border-radius: 4px;
                        flex-shrink: 0;
                        justify-content: center;
                        width: 100%;
                        box-sizing: border-box;

                        .match-info-row-home {
                            display: flex;
                            align-items: center;

                            .match-image-home {
                                width: 30px;
                                height: 30px;
                                margin-right: 10px;
                                object-fit: contain;
                            }

                            .match-name-home {
                                font-size: 14px;
                                color: #303133;
                                white-space: nowrap;
                                overflow: hidden;
                                text-overflow: ellipsis;
                                max-width: 150px;
                            }
                        }

                        .match-time-home {
                            font-size: 12px;
                            color: #606266;
                        }
                    }

                    .no-match-info-home {
                        color: #909399;
                        font-size: 14px;
                        padding: 5px 10px;
                        background-color: #f5f7fa;
                        border-radius: 4px;
                        flex-shrink: 0;
                        width: 100%;
                        box-sizing: border-box;
                    }

                    .saveBnt {
                        margin-left: 20%;
                        width: 100px;
                        margin-top: 10px;
                    }
                }
            }
        }

        &.sixth-card {
            margin-top: 10px;
        }
    }
}

// ===== 聊天室样式 =====
.ChatRoom {
    margin: 10px 0;
}

// ===== 词云相关样式 =====
.wordCloudDiv {
    .word-cloud-title {
        font-size: 24px;
        font-weight: 600;
        color: #303133;
        margin: 0;

    }

    .word-cloud-refresh-icon {
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

    .word-cloud-loading {
        text-align: center;
        padding: 20px;
        color: #909399;
    }
}

// ===== 动画定义 =====
@keyframes rotate {
    from {
        transform: rotate(0deg);
    }
    to {
        transform: rotate(360deg);
    }
}

// ===== 响应式设计 =====
// 大屏幕样式 (601px及以上)
@media (min-width: 601px) {
    .home {
        .wordCloudDiv {
            z-index: 9;
            position: fixed;
            bottom: 10px;
            right: 10px;
        }
    }

    .ChatRoom {
        display: none;
    }

    .AnnualHotList {
        display: none;
    }
}

// 前俩卡片在窄屏下换行展示
@media (max-width: 768px) {
    .home {
        .cards-container {
            flex-direction: column;
        }
    }
}

// 小屏幕样式 (600px及以下)
@media (max-width: 600px) {
    .AnnualHotList {
        margin-bottom: 20px;
    }

    .home {
        width: 100%;

        .boom {
            height: 150px;

            .boom6657 {
                margin-top: 6px;
                height: 130px;
            }
        }

        .wordCloudDiv {
            margin-top: 10px;
            width: 100%;
        }

        .card {
            &.fifth-card {
                margin-top: 8px;

                .match-association-container {
                    .match-section-home {
                        .saveBnt {
                            margin-left: 35%;
                            width: 100px;
                            margin-top: 10px;
                        }
                    }
                }
            }
        }
    }
}
</style>
