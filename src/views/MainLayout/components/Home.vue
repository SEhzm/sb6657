<template>
    <div class="home">
        <div class="boom">
            <img src="https://sb6657oss.wishao.fun/6657boom.webp" alt="6657boom" class="boom6657" />
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
            <div class="tags-tips">
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
            </div>

            <tag-selector v-model:selectedTags="selectedTags" :tags="allTags" />
            <el-input v-model="barrage" maxlength="255" autocomplete="off" :autosize="{ minRows: 2, maxRows: 4 }"
                show-word-limit type="textarea" placeholder="输入你要投稿的烂梗...."></el-input>

            <!-- 新增的关联赛事库部分 -->
            <div class="match-association-container">
                <div class="match-section-home">
                    <el-checkbox v-model="isMatchSelected" :disabled="!matchData" class="match-checkbox-home">
                        关联赛事库
                        <el-icon class="match-help-icon" size="16">
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
                </div>
            </div>
            <el-button class="save-btn" type="primary" @click="saveBarrage">投稿</el-button>
        </div>
        <el-backtop :right="50" :bottom="50" />
        <ChatRoom class="ChatRoom card"></ChatRoom>
        <div class="card sixth-card">
            <span>友情链接</span>
            <a href="https://dgq63136.cn" target="_blank">dgq63136.cn</a>
            <a href="https://sb6657.cn/Starrysky" target="_blank">星空背景</a>
        </div>
        <HomeWordCloudPanel v-if="isMobile" class="mobile-word-cloud" />
    </div>
</template>

<script setup>
import httpInstance from '@/apis/httpInstance';
import ChatRoom from '@/components/ChatRoom.vue';
import DidYouKnow from '@/components/home/didYouKnow.vue';
import HomeIntro from '@/components/home/homeIntro.vue';
import RandomMeme from '@/components/home/random-meme.vue';
import tagSelector from '@/components/tag-selector.vue';
import { API } from '@/constants/backend';
import { useMemeTagsStore } from '@/stores/memeTags';
import { useIsMobile } from '@/utils/common';
import HomeWordCloudPanel from '@/views/MainLayout/components/right-sidebar/HomeWordCloudPanel.vue';
import { QuestionFilled, Warning } from '@element-plus/icons-vue';
import { ElNotification } from 'element-plus';
import { onMounted, ref } from 'vue';
const memeTagsStore = useMemeTagsStore();
const isMobile = useIsMobile();

memeTagsStore.tagsLoaded.then(() => {
    allTags.value = memeTagsStore.memeTags;
});

const barrage = ref('');
const allTags = ref([]);
const selectedTags = ref([]);

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
        })
        .catch((err) => {
            console.error('Failed to fetch in progress match:', err);
            matchData.value = null;
        });
}

onMounted(() => {
    getInProgressMatch();
});

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
</script>

<style scoped lang="scss">
// ===== 主容器样式 =====
.home {
    width: 100%;
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
            display: flex;
            flex-direction: column;
            align-items: center;

            .tags-tips {
                width: 100%;
                display: flex;
                align-items: center;
                flex-wrap: wrap;
                gap: 4px;

                .submit-tag-button {
                    margin-left: auto;
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

                        .match-help-icon {
                            color: #3db302ff;
                        }
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
                }

            }

            .save-btn {
                width: 100px;
                margin-top: 10px;
            }
        }

        &.sixth-card {
            display: flex;
            align-items: center;
            flex-wrap: wrap;
            gap: 12px;
            margin-top: 10px;
        }
    }
}

// ===== 聊天室样式 =====
.ChatRoom {
    margin: 10px 0;
}

// ===== 响应式设计 =====
// 大屏幕样式 (601px及以上)
@media (min-width: 601px) {
    .ChatRoom {
        display: none;
    }

    .mobile-word-cloud {
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
    .home {
        width: 100%;

        .boom {
            height: 150px;

            .boom6657 {
                margin-top: 6px;
                height: 125px;
            }
        }

        .mobile-word-cloud {
            margin-top: 10px;
            width: 100%;
        }

        .card {
            &.fifth-card {
                margin-top: 8px;

                .tags-tips {
                    .submit-tag-button {
                        margin-left: 0;
                    }
                }
            }
        }
    }
}
</style>
