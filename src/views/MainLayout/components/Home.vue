<template xmlns="http://www.w3.org/1999/html">
    <div class="home">
        <div class="boomouder">
            <img src="https://gcore.jsdelivr.net/gh/9WiSHao/AnythingStorage/img/6657boom.webp" alt="6657boom"
                class="boom6657" />
        </div>
        <div class="card first-card">
            <div>
                <b>
                    <p class="announcement">
                        因为GreasyFork被墙，你可以
                        <a href="https://cdn.hguofichp.cn/sb6657.cn%E6%96%97%E9%B1%BC%E7%8E%A9%E6%9C%BA%E5%99%A8%E7%83%82%E6%A2%97%E6%94%B6%E9%9B%86.user.js"
                            target="_blank">点击我下载最新的油猴插件</a>
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
            <div>
                <el-button type="primary" @click="getRandOne">点我随机一条弹幕</el-button>
                <el-table v-loading="loading" :data="data.tableData" class="barrage-table" @row-click="copyText">
                    <el-table-column prop="barrage">
                        <template #default="scope">
                            <el-popover placement="top" :width="'auto'" trigger="hover"
                                :visible="scope.row.popoverVisible">
                                <template #reference>
                                    <div style="cursor: pointer" @touchstart="handleTouchStart(scope.row)"
                                        @touchend="handleTouchEnd(scope.row)">
                                        <span class="barrage-text">{{ scope.row.barrage }}</span>
                                    </div>
                                </template>
                                <template #default>
                                    <div style="display: flex; align-items: center; flex-wrap: wrap">
                                        <div v-for="(item, index) in getDictLabel(scope.row.tags)" :key="index"
                                            style="margin-right: 8px">
                                            <el-tag round effect="dark"
                                                :style="{ fontSize: '16px', cursor: 'pointer' }">
                                                <div class="tag-icon-wrapper">
                                                    <img v-if="item.iconUrl" :src="item.iconUrl"
                                                        style="width: 22px; height: 22px; object-fit: cover; vertical-align: middle" />
                                                    <span style="vertical-align: middle">{{ item.label }}</span>
                                                </div>
                                            </el-tag>
                                        </div>
                                        <span
                                            style="position: absolute; bottom: 0; right: 0; font-size: 11px; min-width: 170px">投稿时间:
                                            {{ formatSubmitTime(scope.row.submitTime) }}</span>
                                    </div>
                                </template>
                            </el-popover>
                        </template>
                    </el-table-column>
                    <el-table-column label="" align="center" width="85">
                        <el-button type="primary">复制</el-button>
                    </el-table-column>
                </el-table>
            </div>
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
                    <el-button link type="success" style="margin-left: 50%">
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
                        <el-tag round v-for="(tag, index) in presetTags" :key="index" closable
                            @close="removeTagFromPreset(tag)" @click="removeTagFromPreset(tag)"
                            style="padding: 15px; cursor: pointer; font-size: 16px" type="primary">
                            <div class="tag-icon-wrapper">
                                <img v-if="tag.iconUrl" :src="tag.iconUrl"
                                    style="width: 22px; height: 22px; object-fit: cover; vertical-align: middle" />
                                <span style="vertical-align: middle">{{ tag.label }}</span>
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
                    <el-tag round v-for="(tag, index) in addedTags" :key="index" closable @click="removeTag(tag)"
                        @close="removeTag(tag)" style="padding: 15px; cursor: pointer; font-size: 16px" effect="dark">
                        {{ tag.label }}
                    </el-tag>
                </div>
                <el-input v-model="barrage" maxlength="255" autocomplete="off" :autosize="{ minRows: 2, maxRows: 4 }"
                    show-word-limit type="textarea" placeholder=" 烂梗...."></el-input>

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
                                <img :src="matchData.matchesImg" class="match-image-home"
                                    :alt="matchData.matchesName" />
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
            <span style="background-color: white; border-radius: 25px; padding: 5px">
                搜索词云
                <el-icon size="20" style="cursor: pointer; animation: rotating 4s linear infinite reverse"
                    @click="refreshWordCloud()">
                    <Refresh />
                </el-icon>
            </span>
            <Suspense>
                <template #default>
                    <WordCloud ref="wordCloudRef" />
                </template>
                <template #fallback>
                    <div style="height: 270px; width: 300px">词云加载中...</div>
                </template>
            </Suspense>
        </div>
    </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import httpInstance from '@/apis/httpInstance';
import { ElMessage, ElNotification, ElMessageBox } from 'element-plus';
import ChatRoom from '@/components/ChatRoom.vue';
import { API } from '@/constants/backend';

const loading = ref(true);

const data = reactive({
    getRandOne: [],
    tableData: [],
    table: '',
    barrage: '',
});

const dictData = ref([]);

const getDict = () => {
    httpInstance
        .get('/machine/dictList')
        .then((res) => {
            if (res.code === 200) {
                dictData.value = res.data;
                presetTags.value = res.data.map((item) => ({
                    iconUrl: item.iconUrl,
                    label: item.dictLabel,
                    value: item.dictValue,
                }));
            }
        })
        .catch((err) => {
            console.error('获取字典数据失败', err);
        });
};
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

getDict();

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

let lastCallTime = 0;
let lastMousePosition = null;
let mousePositionCnt = 0;
const copyText = (row) => {
    const currentTime = new Date().getTime();
    const currentMousePosition = { x: event.clientX, y: event.clientY };
    // 检查鼠标位置是否变化
    if (lastMousePosition && lastMousePosition.x === currentMousePosition.x && lastMousePosition.y === currentMousePosition.y) {
        mousePositionCnt++;
        if (mousePositionCnt > 4) {
            ElMessageBox.alert('😡😡😡你在刷次数😡😡😡', '请勿使用连点器', {
                confirmButtonText: '好吧，我错了',
            });
        }
    } else {
        mousePositionCnt = 0;
    }
    // 检查是否已经过了 1.5 秒
    if (currentTime - lastCallTime < 1500) {
        ElNotification({
            title: '请勿刷次数',
            message: '复制成功，但次数没有增加',
            type: 'warning',
        });
        const textToCopy = row.barrage;
        let tempInput = document.createElement('input');
        tempInput.value = textToCopy;
        document.body.appendChild(tempInput);
        tempInput.select(); // 选择对象
        try {
            document.execCommand('Copy'); // 执行浏览器复制命令
        } catch (err) {
            // 复制失败，可以显示错误信息
            ElNotification({
                title: '复制失败',
                message: '复制操作失败，请稍后重试',
                type: 'error',
            });
            console.error('复制失败:', err);
        }
        document.body.removeChild(tempInput); // 清理临时元素
        lastCallTime = currentTime;
        lastMousePosition = currentMousePosition;
        return;
    }
    lastMousePosition = currentMousePosition;
    lastCallTime = currentTime;
    const textToCopy = row.barrage;
    let tempInput = document.createElement('input');
    tempInput.value = textToCopy;
    document.body.appendChild(tempInput);
    tempInput.select(); // 选择对象
    try {
        document.execCommand('Copy'); // 执行浏览器复制命令
        // 复制成功，可以显示提示信息
        open2();
        console.log('内容已复制到剪贴板');
        httpInstance.get('/machine/addCnt/' + `${row.id}`).then(() => {
            //setTimeout(() => load(data.currentPage), 50); // 50 毫秒后执行 load
        });
    } catch (err) {
        // 复制失败，可以显示错误信息
        ElNotification({
            title: '复制失败',
            message: '复制操作失败，请稍后重试',
            type: 'error',
        });
        console.error('复制失败:', err);
        open4();
    }
    document.body.removeChild(tempInput); // 清理临时元素
};

//移动端的触摸展示
const handleTouchStart = (row) => {
    row.touchStartTime = Date.now();
};

const handleTouchEnd = (row) => {
    const touchEndTime = Date.now();
    if (touchEndTime - row.touchStartTime > 100) {
        //100ms 长按时长
        row.popoverVisible = true;
        setTimeout(() => {
            row.popoverVisible = false;
        }, 1500);
    }
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
onMounted(() => { });
</script>

<style scoped lang="scss">
/* 预设标签容器 */
.preset-tags-container {
    max-height: 75px;
    overflow-y: auto;
    margin-top: 10px;
    margin-bottom: 20px;
}

/* 预设标签按钮的样式 */
.preset-tags {
    display: flex;
    flex-wrap: wrap;
}

.preset-tags .el-tag {
    position: relative;
    margin-right: 10px;
    margin-bottom: 10px;
}

:deep(.preset-tags .el-tag__close) {
    font-size: 30px;
    transform: rotate(45deg);
}

.added-tags {
    display: flex;
    flex-wrap: wrap;
}

.added-tags .el-tag {
    margin-right: 10px;
    margin-bottom: 10px;
}

.home {
    height: auto;
    width: 80%;

    .boomouder {
        height: 150px;

        .boom6657 {
            left: calc(50vw - 153px);
            position: absolute;
            height: 150px;
            border-radius: 10px;
        }
    }

    .card {
        line-height: 25px;

        &.first-card {
            margin-top: 10px;
        }

        &.second-card {
            margin-top: 8px;
        }

        &.third-card {
            line-height: 0px;
            margin-top: 8px;
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

    .announcement-highlight {
        font-size: 18px;
        color: red;

        a {
            color: red;
        }
    }

    .barrage-table {
        font-family: 微软雅黑;
        font-size: 20px;
        cursor: pointer;

        :deep(.el-table__header-wrapper) {
            font-size: 14px;
            white-space: normal !important;
        }
    }

    .submit-button {
        font-size: 20px;
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
                width: 192px;
                height: 118px;
                left: 25%;
            }
        }
    }

    .ChatRoom {
        margin: 10px 0;
    }

    .match-association-container {
        flex-direction: column;
        align-items: stretch;
        gap: 12px;
        padding: 8px;
    }

    .match-section-home {
        flex-direction: column;
        align-items: flex-start;
        width: 100%;
        gap: 8px;
    }

    .match-details-box-home,
    .no-match-info-home {
        width: 100%;
        box-sizing: border-box;
    }

    .button-group-home {
        width: 100%;
        margin-left: 0;
        justify-content: flex-end;
    }
}

.tag-icon-wrapper {
    height: 100%;
    width: 100%;
    display: flex;
    align-items: center;
}
</style>
