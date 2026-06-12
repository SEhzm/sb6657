<template>
    <el-dialog v-model="dialogFormVisible" class="submission-dialog" draggable title="投稿烂梗" width="82%">
        <!-- 预设标签 -->
        <h4 class="tags-title">
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
            <el-button class="submit-tag-button" link type="success">
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
        </h4>

        <tag-selector v-model:selectedTags="selectedTags" :tags="allTags" />
        <el-input v-model="barrage" maxlength="255" autocomplete="off" :autosize="{ minRows: 2, maxRows: 4 }"
            show-word-limit type="textarea" placeholder=" 烂梗...."></el-input>
        <template #footer>
            <div class="footer-container">
                <div class="match-section">
                    <el-checkbox v-model="isMatchSelected" :disabled="!matchData" class="match-checkbox">
                        关联赛事库
                        <el-icon class="match-help-icon" size="16">
                            <QuestionFilled />
                        </el-icon>
                    </el-checkbox>
                    <div v-if="matchData" class="match-details-box">
                        <div class="match-info-row">
                            <img :src="matchData.matchesImg" class="match-image" :alt="matchData.matchesName" />
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
                    <el-button plain @click="dialogFormVisible = false">关闭</el-button>
                    <el-button type="primary" @click="saveBarrage">投稿</el-button>
                </div>
            </div>
        </template>
    </el-dialog>

</template>

<script setup>
import httpInstance from '@/apis/httpInstance';
import tagSelector from '@/components/tag-selector.vue';
import { API } from '@/constants/backend';
import { useMemeTagsStore } from '@/stores/memeTags';
import { ElNotification } from 'element-plus';
import { ref } from 'vue';
const memeTagsStore = useMemeTagsStore();

const barrage = ref('');
const allTags = ref([]);
const selectedTags = ref([]);

// 获取字典数据
memeTagsStore.tagsLoaded.then(() => {
    allTags.value = memeTagsStore.memeTags;
});

const matchData = ref(null);
function getMatch() {
    httpInstance.get('/machine/InProgressMatch').then(res => {
        // 检查 res.data 是否为 null 或空，以确保 matchData 正确赋值
        if (res.code === 200 && res.data) {
            matchData.value = res.data;
        } else {
            matchData.value = null; // 确保 matchData 为 null 当没有正在进行的赛事时
        }
    });
}
getMatch();


const saveBarrage = () => {
    const selectedValues = selectedTags.value.map((t) => t.dictValue);
    if (selectedValues.length === 0 || !barrage.value) {
        ElNotification.error('请选择标签或输入弹幕');
    } else {
        if (selectedValues.length > 5) {
            ElNotification.error('最少一个标签，最多五个标签。');
            return;
        }
        const submitData = {
            tags: selectedValues.join(','),
            barrage: barrage.value,
        };

        if (isMatchSelected.value && matchData.value) {
            submitData.matchId = matchData.value.id;
        }

        httpInstance
            .post(API.SUBMIT_MEME, submitData)
            .then((res) => {
                barrage.value = '';
                isMatchSelected.value = false;
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
const dialogFormVisible = defineModel();
const isMatchSelected = ref(false);

</script>

<style scoped lang="scss">
.tags-title {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 4px;
    margin-top: -10px;
    margin-bottom: 10px;

    .submit-tag-button {
        margin-left: 40%;
    }
}

.footer-container {
    width: 100%;
    margin-top: 10px;
    border-radius: 4px;
    box-sizing: border-box;

    .match-section {
        display: flex;
        align-items: center;
        flex: 1;
        flex-wrap: wrap;
        gap: 10px;
        padding: 12px;
        background-color: #f5f7fa;

        .match-checkbox {
            margin-right: 10px;
            white-space: nowrap;

            .match-help-icon {
                color: #3db302ff;
            }
        }

        .match-details-box {
            display: flex;
            flex-direction: column;
            flex-shrink: 0;
            justify-content: center;
            padding: 5px 10px;
            border-radius: 4px;
            background-color: #e6f5f2ff;

            .match-info-row {
                display: flex;
                align-items: center;

                .match-image {
                    width: 30px;
                    height: 30px;
                    margin-right: 10px;
                    object-fit: contain;
                }

                .match-name {
                    max-width: 150px;
                    overflow: hidden;
                    color: #303133;
                    font-size: 14px;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }
            }

            .match-time {
                margin-top: 4px;
                color: #606266;
                font-size: 12px;
            }
        }

        .no-match-info {
            flex-shrink: 0;
            padding: 5px 10px;
            border-radius: 4px;
            background-color: #f5f7fa;
            color: #909399;
            font-size: 14px;
        }
    }

    .button-group {
        width: 100%;
        display: flex;
        justify-content: center;
        gap: 10px;
        margin-top: 10px;
    }
}

@media screen and (max-width: 768px) {
    .tags-title {
        .submit-tag-button {
            margin-left: 0;
        }
    }

    .footer-container {
        padding: 8px;

        .match-section {
            width: 100%;
            flex-direction: column;
            align-items: flex-start;
            gap: 8px;

            .match-details-box,
            .no-match-info {
                width: 100%;
                box-sizing: border-box;
            }
        }

        .button-group {
            justify-content: flex-end;
        }
    }

    :deep(.submission-dialog) {
        width: 95% !important;
        margin: 10px auto !important;
    }
}
</style>
