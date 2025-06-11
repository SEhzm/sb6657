<template>
    <el-dialog v-model="dialogFormVisible" draggable title="投稿烂梗" width="82%">
        <!-- 预设标签 -->
        <h4>可选标签<el-popover :width="300">
                <template #reference>
                    <el-icon size="16">
                        <Warning />
                    </el-icon>
                </template>
                为解决烂梗分栏不足和分类不清晰问题。<br>
                <b>点击标签即可添加</b>
            </el-popover>
            <el-button link type="success" style="margin-left: 50%">投稿标签
                <el-popover :width="300">
                    <template #reference>
                        <el-icon size="16">
                            <QuestionFilled />
                        </el-icon>
                    </template>
                    <b>请在上方(建议/提交)问卷投稿。</b><br>
                </el-popover>
            </el-button>
        </h4>

        <div class="preset-tags-container">
            <div class="preset-tags">
                <el-tag round v-for="(tag, index) in presetTags" :key="index" closable @close="removeTagFromPreset(tag)"
                    @click="removeTagFromPreset(tag)" style=" padding:15px; cursor: pointer;font-size: 16px;"
                    type="primary">
                    <img v-if="tag.iconUrl" :src="tag.iconUrl"
                        style=" width: 22px; height: 22px; object-fit: cover;vertical-align: middle;" />
                    <span style="vertical-align: middle;"> {{ tag.label }}</span>
                </el-tag>
            </div>
        </div>

        <!-- 已添加标签 -->
        <h4>已选标签
            <el-popover :width="300">
                <template #reference>
                    <el-icon size="16">
                        <Warning />
                    </el-icon>
                </template>
                <b>最少一个标签，最多五个标签。</b>
            </el-popover>
        </h4>

        <div class="added-tags">
            <el-tag round v-for="(tag, index) in addedTags" :key="index" closable @click="removeTag(tag)"
                @close="removeTag(tag)" style="padding:15px; cursor: pointer;font-size: 16px;" effect="dark">
                {{ tag.label }}
            </el-tag>
        </div>
        <el-input v-model="barrage" maxlength="255" autocomplete="off" :autosize="{ minRows: 2, maxRows: 4 }"
            show-word-limit type="textarea" placeholder=" 烂梗...."></el-input>
        <template #footer>
            <div class="footer-container">
                <div class="match-section">
                    <el-checkbox v-model="isMatchSelected" :disabled="!matchData" class="match-checkbox">
                        关联赛事库
                        <el-icon color="#3db302ff" size="16">
                            <QuestionFilled />
                        </el-icon>
                    </el-checkbox>
                    <div v-if="matchData" class="match-details-box">
                        <div class="match-info-row">
                            <img :src="matchData.matchesImg" class="match-image" :alt="matchData.matchesName">
                            <span class="match-name">{{ matchData.matchesName }}</span>
                        </div>
                        <div class="match-time">
                            {{ matchData.startTime }} 至 {{ matchData.endTime }}
                        </div>
                    </div>
                    <div v-else class="no-match-info">
                        当前无正在进行的大型赛事
                    </div>
                </div>
                <div class="button-group">
                    <el-button type="plain" @click="dialogFormVisible = false">关闭</el-button>
                    <el-button type="primary" @click="saveBarrage">投稿</el-button>
                </div>
            </div>
        </template>
    </el-dialog>

</template>

<script setup>
import { ElMessage, ElNotification } from 'element-plus';
import httpInstance from '@/apis/httpInstance';
import { API } from '@/constants/backend';
import { ref } from 'vue';
const barrage = ref('');
// 预设标签
const presetTags = ref([]);

// 已添加标签
const addedTags = ref([]);

// 已添加标签的 dictValue 数组
const addedDictValues = ref([]);

// 获取字典数据
function getDict() {
    httpInstance.get('/machine/dictList').then(res => {
        if (res.code === 200) {
            presetTags.value = res.data.map(item => ({
                iconUrl: item.iconUrl,
                label: item.dictLabel,
                value: item.dictValue
            }));
        }
    });
}
getDict();

const matchData = ref(null);
function getMatch() {
    httpInstance.get('/machine/InProgressMatch').then(res => {
        // 检查 res.data 是否为 null 或空，以确保 matchData 正确赋值
        if (res.code === 200 && res.data) {
            matchData.value = res.data;
        } else {
            matchData.value = null; // 确保 matchData 为 null 当没有正在进行的赛事时
        }
        console.log(matchData);
    });
}
getMatch();

// 删除已添加标签
const removeTag = (tag) => {
    addedTags.value = addedTags.value.filter(t => t.value !== tag.value);
    addedDictValues.value = addedDictValues.value.filter(value => value !== tag.value);
    presetTags.value.push(tag);
};

// 添加标签的点击事件
const removeTagFromPreset = (tag) => {
    if (addedDictValues.value.length >= 5) {
        ElNotification.info("最多5个标签")
        return
    }
    // 当删除预设标签时，将其移到已添加标签
    if (!addedTags.value.some(t => t.value === tag.value)) {
        addedTags.value.push(tag);
        addedDictValues.value.push(tag.value);
        presetTags.value = presetTags.value.filter(t => t.value !== tag.value);
    }
};

const saveBarrage = () => {
    if (addedDictValues.value.length === 0 || barrage.value === '' || barrage.value === null) {
        ElNotification.error("请选择标签或输入弹幕");
    } else {
        if (addedDictValues.value.length > 5) {
            ElNotification.error('最少一个标签，最多五个标签。');
            return;
        }
        const submitData = {
            tags: addedDictValues.value.join(','),
            barrage: barrage.value
        };

        if (isMatchSelected.value && matchData.value) {
            submitData.matchId = matchData.value.id;
        }

        httpInstance.post(API.SUBMIT_MEME, submitData).then(res => {
            barrage.value = '';
            isMatchSelected.value = false;
            if (res.code === 200) {
                ElNotification.success("投稿成功，待审核(一天内)");
            } else if (res.code === 500) {
                ElNotification.error("烂梗已经有了，勿重复提交")
            } else {
                ElNotification.error("请求失败");
            }
        }).catch(err => {
            console.error('投稿失败', err);
            ElNotification.error("请求失败");
        });
    }
};
const dialogFormVisible = defineModel();
const isMatchSelected = ref(false);

</script>

<style scoped>
h3 {
    margin-top: 20px;
}

/* 预设标签容器 */
.preset-tags-container {
    max-height: 100px;
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

::v-deep .preset-tags .el-tag__close {
    font-size: 30px;
    transform: rotate(45deg);
}

.added-tags {
    min-height: 40px;
    display: flex;
    flex-wrap: wrap;
    margin-top: 10px;
}

.added-tags .el-tag {
    margin-right: 10px;
    margin-bottom: 10px;
}

/* 底部容器 */
.footer-container {
    display: flex;
    align-items: center;
    width: 100%;
    background-color: #f5f7fa;
    padding: 12px;
    border-radius: 4px;
    margin-top: 10px;
    box-sizing: border-box;
}

.match-section {
    display: flex;
    align-items: center;
    flex: 1;
    flex-wrap: wrap;
    gap: 10px;
}

/* Checkbox specific style */
.match-checkbox {
    margin-right: 10px;
    white-space: nowrap;
}

/* 比赛详情框 (绿色背景部分) */
.match-details-box {
    display: flex;
    flex-direction: column;
    background-color: #e6f5f2ff;
    padding: 5px 10px;
    border-radius: 4px;
    flex-shrink: 0;
    justify-content: center;
}

.match-info-row {
    display: flex;
    align-items: center;
}

/* 比赛图片 */
.match-image {
    width: 30px;
    height: 30px;
    margin-right: 10px;
    object-fit: contain;
}

/* 比赛名称 */
.match-name {
    font-size: 14px;
    color: #303133;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 150px;
}

/* 比赛时间 */
.match-time {
    font-size: 12px;
    color: #606266;
    margin-top: 4px;
}

/* 无赛事提示 */
.no-match-info {
    color: #909399;
    font-size: 14px;
    padding: 5px 10px;
    background-color: #f5f7fa;
    border-radius: 4px;
    flex-shrink: 0;
}

/* 按钮组 */
.button-group {
    display: flex;
    gap: 10px;
    margin-left: 10px;
}

/* 移动端适配 */
@media screen and (max-width: 768px) {
    .footer-container {
        flex-direction: column;
        align-items: stretch;
        gap: 12px;
        padding: 8px;
    }

    .match-time {
        font-size: 12px;
        color: #606266;
        margin-top: 4px;
    }

    .match-section {
        flex-direction: column;
        align-items: flex-start;
        width: 100%;
        gap: 8px;
    }

    .match-details-box,
    .no-match-info {
        width: 100%;
        box-sizing: border-box;
    }

    .button-group {
        width: 100%;
        margin-left: 0;
        justify-content: flex-end;
    }

    .el-dialog {
        width: 95% !important;
        margin: 10px auto !important;
    }
}
</style>