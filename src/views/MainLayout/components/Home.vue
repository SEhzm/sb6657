<template xmlns="http://www.w3.org/1999/html">
    <div class="home">
        <div class="boomouder">
            <img src="https://gcore.jsdelivr.net/gh/9WiSHao/AnythingStorage/img/6657boom.webp" alt="6657boom" class="boom6657" />
        </div>
        <div class="cards-container">
            <div class="card first-card">
                <div>
                    <p class="announcement">
                        <b>这是一个收集6657烂梗的网站：</b>
                        <span class="dgq63136">
                            <a href="https://sb6657.cn">sb6657.cn</a>
                        </span>
                        尽情欣赏你们的烂梗吧。
                    </p>
                    <p class="sub-info">
                        <b>
                            油猴插件
                            <a href="https://cdn.hguofichp.cn/sb6657.cn%E6%96%97%E9%B1%BC%E7%8E%A9%E6%9C%BA%E5%99%A8%E7%83%82%E6%A2%97%E6%94%B6%E9%9B%86.user.js" target="_blank">点击下载</a>
                            可在斗鱼直播间一键复制烂梗
                        </b>
                    </p>
                    <p class="sub-info">开放注册功能，可能会出现收不到邮件的情况。</p>
                    <p class="sub-info">目前已支持玩机器直播间开播提醒</p>
                    <p class="sub-info">
                        <RouterLink to="/update">网站更新日志</RouterLink>
                    </p>
                </div>
            </div>

            <div class="card second-card">
                <div class="did-you-know">
                    <h3>🤔 你知道吗？</h3>
                    <ul class="knowledge-list">
                        <li>
                            HeavyGod目前打出了对位donk最多的击杀， Brollan被donk打出了最多的击杀
                            <RouterLink to="/15warriorsDonk">- 布雷德15勇士</RouterLink>
                        </li>
                        <li>
                            Jimpphat是目前擒niko最多的选手，反之broky是被niko擒住次数最多的选手
                            <RouterLink to="/dejaVuNiko">- 超级逮虾户战报</RouterLink>
                        </li>
                        <li class="placeholder-item">
                            <!-- 预留给最后投稿弹幕内容 -->
                        </li>
                    </ul>
                </div>
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
import { RouterLink } from 'vue-router';

const memeTagsStore = useMemeTagsStore();

const dictData = ref([]);
memeTagsStore.tagsLoaded.then(() => {
    console.log('dictData', memeTagsStore.memeTags);
    dictData.value = memeTagsStore.memeTags;
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
/* 标签相关样式 */
.submit-tag-button {
    margin-left: 50%;
}

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

.preset-tag {
    padding: 15px;
    cursor: pointer;
    font-size: 16px;
}

.added-tags {
    display: flex;
    flex-wrap: wrap;

    .el-tag {
        margin-right: 10px;
        margin-bottom: 10px;
    }
}

.added-tag {
    padding: 15px;
    cursor: pointer;
    font-size: 16px;
}

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

.home {
    height: auto;
    width: 80%;

    // 顶部横幅区域
    .boomouder {
        height: 150px;

        .boom6657 {
            left: calc(50vw - 153px);
            position: absolute;
            height: 150px;
            border-radius: 10px;
        }
    }

    // 卡片容器
    .cards-container {
        display: flex;
        gap: 16px;
        margin-top: 10px;

        // 响应式布局：窄屏时变为竖排
        @media (max-width: 768px) {
            flex-direction: column;
            gap: 8px;
        }
    }

    .card {
        line-height: 25px;
        flex: 1; // 让两个卡片平分宽度

        &.first-card {
            margin-top: 0; // 重置margin，由容器控制间距
        }

        &.second-card {
            margin-top: 0; // 重置margin，由容器控制间距
        }

        &.third-card {
            margin-top: 8px;
            padding: 12px;
        }

        &.fifth-card {
            margin-top: 8px;

            .saveBnt {
                margin-left: 20%;
                width: 100px;
                margin-top: 10px;
            }
        }

        &.sixth-card {
            margin-top: 10px;
        }
    }

    .announcement {
        font-size: 16px;
        margin-bottom: 8px;
    }

    .sub-info {
        font-size: 14px;
        color: #666;
        margin-top: 8px;

        a {
            color: #409eff;
            text-decoration: none;

            &:hover {
                text-decoration: underline;
            }
        }
    }

    .dgq63136 {
        font-size: 20px;
        font-weight: bold;

        a {
            color: red;
            text-decoration: none;

            &:hover {
                text-decoration: underline;
            }
        }
    }

    // "你知道吗？"卡片样式
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
}

.match-association-container {
    display: flex;
    align-items: center;
    width: 100%;
    background-color: #f5f7fa;
    padding: 12px;
    border-radius: 4px;
    margin-top: 10px;
    box-sizing: border-box;
}

.match-section-home {
    display: flex;
    align-items: center;
    flex: 1;
    flex-wrap: wrap;
    gap: 10px;
}

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
}

.match-info-row-home {
    display: flex;
    align-items: center;
}

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

.match-time-home {
    font-size: 12px;
    color: #606266;
}

.no-match-info-home {
    color: #909399;
    font-size: 14px;
    padding: 5px 10px;
    background-color: #f5f7fa;
    border-radius: 4px;
    flex-shrink: 0;
}

.button-group-home {
    display: flex;
    gap: 10px;
    margin-left: 10px;
}

// 响应式设计
@media (min-width: 601px) {
    .home {
        .wordCloudDiv {
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

@media (max-width: 600px) {
    .AnnualHotList {
        margin-bottom: 20px;
    }

    .home {
        width: 100%;

        .wordCloudDiv {
            margin-top: 10px;
        }

        .card {
            &.fifth-card {
                margin-top: 8px;

                .saveBnt {
                    margin-left: 35%;
                    width: 100px;
                    margin-top: 10px;
                }
            }
        }

        .boomouder {
            height: 150px;

            .boom6657 {
                position: absolute;
                border-radius: 10px;
                height: 118px;
                left: 25%;
            }
        }
    }
}

// 弹窗内容样式
.popover-content {
    .tags-container {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        margin-bottom: 8px;

        .tag-item {
            margin-right: 8px;
            margin-bottom: 4px;
        }

        .custom-tag {
            font-size: 16px;
            cursor: pointer;
        }

        .tag-icon-wrapper {
            display: flex;
            align-items: center;

            .tag-icon {
                width: 22px;
                height: 22px;
                object-fit: cover;
                margin-right: 4px;
            }

            .tag-label {
                vertical-align: middle;
            }
        }
    }

    .submit-time {
        font-size: 11px;
        color: #909399;
        text-align: right;
        margin-top: 4px;
        border-top: 1px solid #ebeef5;
        padding-top: 4px;
    }
}

.ChatRoom {
    margin: 10px 0;
}

.match-details-box-home,
.no-match-info-home {
    width: 100%;
    box-sizing: border-box;
}

.tag-icon-wrapper {
    height: 100%;
    width: 100%;
    display: flex;
    align-items: center;
}

/* 词云相关样式 */
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

@keyframes rotate {
    from {
        transform: rotate(0deg);
    }
    to {
        transform: rotate(360deg);
    }
}
</style>
