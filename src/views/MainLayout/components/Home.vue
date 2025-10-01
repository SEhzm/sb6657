<template xmlns="http://www.w3.org/1999/html">
    <div class="home">
        <div class="boomouder">
            <img src="https://gcore.jsdelivr.net/gh/9WiSHao/AnythingStorage/img/6657boom.webp" alt="6657boom" class="boom6657" />
        </div>
        <div class="card first-card">
            <div>
                <b>
                    <p class="announcement">
                        因为GreasyFork被墙，你可以
                        <a href="https://cdn.hguofichp.cn/sb6657.cn%E6%96%97%E9%B1%BC%E7%8E%A9%E6%9C%BA%E5%99%A8%E7%83%82%E6%A2%97%E6%94%B6%E9%9B%86.user.js" target="_blank">点击我下载最新的油猴插件</a>
                        ，你只需要将下载的文件拖入油猴管理面板即可
                    </p>
                </b>
            </div>
        </div>

        <div class="card second-card">
            <p>
                这是一个收集6657烂梗的网站:
                <span class="dgq63136">
                    <a href="https://sb6657.cn">sb6657.cn</a>
                </span>
                尽情欣赏你们的烂梗吧。
                <b>开放注册功能，可能会出现收不到邮件的情况。</b>
                <b>目前已支持玩机器直播间开播提醒</b>
            </p>
        </div>

        <div class="card third-card">
            <div class="random-barrage-header">
                <h3 class="random-barrage-title">随机一条烂梗</h3>
                <div class="refresh-controls">
                    <span class="refresh-text" @click="handleRefresh">换一换</span>
                    <el-icon :class="['refresh-icon', { rotating: isRotating }]" @click="handleRefresh" size="18">
                        <Refresh />
                    </el-icon>
                </div>
            </div>

            <div v-if="data.tableData && data.tableData.length > 0" class="modern-barrage-container">
                <div class="modern-barrage-card" @click="handleCopyMeme(data.tableData[0])">
                    <div class="barrage-main-content">
                        <div class="barrage-text-wrapper">
                            <span class="barrage-text">{{ data.tableData[0].barrage }}</span>
                        </div>

                        <div class="barrage-meta-info">
                            <div class="tags-container" v-if="getDictLabel(data.tableData[0].tags).length > 0">
                                <div v-for="(item, index) in getDictLabel(data.tableData[0].tags)" :key="index" class="modern-tag">
                                    <img v-if="item.iconUrl" :src="item.iconUrl" class="tag-icon" />
                                    <span class="tag-label">{{ item.label }}</span>
                                </div>
                            </div>
                            <div class="submit-time"><span class="meme-id">#{{ data.tableData[0].id }}</span>{{ formatSubmitTime(data.tableData[0].submitTime) }}</div>
                        </div>
                    </div>

                    <div class="modern-copy-button" @click.stop="handleCopyMeme(data.tableData[0])">
                        <div class="copy-text">复制</div>
                        <div class="copy-icon">📋</div>
                        <div class="copy-count">
                            <flip-num :num="data.tableData[0].cnt || 0" />
                        </div>
                        <div class="copy-ripple"></div>
                    </div>
                </div>
            </div>
            <div v-else class="no-data">暂无弹幕数据</div>
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
import { ref, reactive, onMounted, defineAsyncComponent } from 'vue';
import httpInstance from '@/apis/httpInstance';
import { ElMessage, ElNotification } from 'element-plus';
import { Refresh, Warning, QuestionFilled } from '@element-plus/icons-vue';
import ChatRoom from '@/components/ChatRoom.vue';
import flipNum from '@/components/flip-num.vue';
import { API } from '@/constants/backend';
import { copyCountPlus1, plus1Error } from '@/apis/setMeme';
import { throttle } from '@/utils/throttle';
import { copyToClipboard, copySuccess, limitedCopy } from '@/utils/clipboard';
import { useMemeTagsStore } from '@/stores/memeTags';
const memeTagsStore = useMemeTagsStore();

const loading = ref(true);
const isRotating = ref(false);

const data = reactive({
    tableData: [],
});

const dictData = ref([]);
memeTagsStore.tagsLoaded.then(() => {
    console.log('dictData', memeTagsStore.memeTags);
    dictData.value = memeTagsStore.memeTags
    presetTags.value = memeTagsStore.memeTags.map((item) => ({
        iconUrl: item.iconUrl,
        label: item.dictLabel,
        value: item.dictValue,
    }))
});

const getDictLabel = (tags) => {
    if (!tags || tags.trim() === '') {
        return [];
    }
    const tagList = Array.from(new Set(tags.split(',').map((tag) => tag.trim())));
    if (!dictData.value) {
        return tagList.map(() => ({ label: '', iconUrl: '' }));
    }
    const dictMap = new Map(dictData.value.map((item) => [String(item.dictValue).trim(), item]));
    const labels = tagList.map((tag) => {
        const dictItem = dictMap.get(tag);
        return dictItem ? { label: dictItem.dictLabel, iconUrl: dictItem.iconUrl } : { label: '', iconUrl: '' };
    });

    return labels;
};

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

const getRandOne = () => {
    httpInstance
        .get(API.GET_RAND_ONE_MEME)
        .then((res) => {
            data.tableData = [res.data];
            // console.log(res)
            loading.value = false;
        })
        .catch((err) => {
            console.error('随机失败');
        });
};

// 新的刷新处理函数，包含旋转动画
const handleRefresh = async () => {
    if (loading.value) return;

    isRotating.value = true;
    loading.value = true;

    try {
        await httpInstance.get(API.GET_RAND_ONE_MEME).then((res) => {
            data.tableData = [res.data];
            loading.value = false;
        });
    } catch (err) {
        console.error('随机失败');
        loading.value = false;
    }

    // 旋转动画持续600ms
    setTimeout(() => {
        isRotating.value = false;
    }, 600);
};

// 节流过的复制，2s内多次点击复制只取其中一次发请求给后台
const copyMeme = throttle(copyToClipboard, limitedCopy, 2000);
async function handleCopyMeme(meme) {
    const copyResult = copyMeme(meme.barrage);
    if (!copyResult || copyResult === 'limitedSuccess') return;

    copySuccess();

    try {
        const success = await copyCountPlus1('', meme.id);
        if (success) {
            // 更新本地复制计数
            data.tableData[0].cnt = `${+data.tableData[0].cnt + 1}`;
        } else {
            plus1Error();
        }
    } catch (error) {
        console.error('更新复制计数失败:', error);
        plus1Error();
    }
}

getRandOne();

const open2 = () => {
    ElMessage({
        message: '复制成功',
        type: 'success',
    });
};

const open4 = () => {
    ElMessage({
        message: '复制失败，请检查浏览器是否禁用navigator.clipboard对象或手动复制,请勿使用夸克浏览器',
        type: 'error',
    });
};

const wordCloudRef = ref(null);
// 懒加载 wordCloud 组件
const WordCloud = defineAsyncComponent(() => import('@/components/wordCloud.vue'));
function refreshWordCloud() {
    wordCloudRef.value?.getData?.();
}
// 处理投稿时间格式
const formatSubmitTime = (timeString) => {
    if (!timeString) return '';
    return timeString.replace('T', ' ').split('.')[0];
};
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
    .card {
        line-height: 25px;

        &.first-card {
            margin-top: 10px;
        }

        &.second-card {
            margin-top: 8px;
        }

        &.third-card {
            margin-top: 8px;
            padding: 12px;

            .random-barrage-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 16px;

                .random-barrage-title {
                    margin: 0;
                    font-size: 24px;
                    font-weight: 600;
                    color: #303133;
                }

                .refresh-controls {
                    display: flex;
                    align-items: center;
                }

                .refresh-text {
                    font-size: 18px;
                    color: #409eff;
                    cursor: pointer;
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
        font-size: 15px;
    }

    .dgq63136 {
        font-size: 23px;
        font-weight: bold;

        a {
            color: red;
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
